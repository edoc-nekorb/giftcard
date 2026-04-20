export interface VerificationRequest {
  id: string
  brand: string
  brandColor: string
  amount: string
  cardNumber: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

let loaded = false
let loadPromise: Promise<void> | null = null
let requestsCache: VerificationRequest[] = []
let writeQueue: Promise<void> = Promise.resolve()

function shouldUseVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN)
}

function getStoreFilePath() {
  const configuredPath = process.env.VERIFICATION_STORE_FILE
  if (configuredPath) return configuredPath
  return 'server-data/verification-requests.json'
}

async function readFileStore(): Promise<VerificationRequest[]> {
  const { mkdir, readFile } = await import('node:fs/promises')
  const path = await import('node:path')

  const storeFilePath = getStoreFilePath()
  const fullPath = path.isAbsolute(storeFilePath)
    ? storeFilePath
    : path.join(process.cwd(), storeFilePath)

  await mkdir(path.dirname(fullPath), { recursive: true })

  try {
    const raw = await readFile(fullPath, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as VerificationRequest[]) : []
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function writeFileStore(items: VerificationRequest[]) {
  const { mkdir, rename, writeFile } = await import('node:fs/promises')
  const path = await import('node:path')

  const storeFilePath = getStoreFilePath()
  const fullPath = path.isAbsolute(storeFilePath)
    ? storeFilePath
    : path.join(process.cwd(), storeFilePath)

  await mkdir(path.dirname(fullPath), { recursive: true })

  const tmpPath = `${fullPath}.tmp`
  await writeFile(tmpPath, JSON.stringify(items, null, 2), 'utf8')
  await rename(tmpPath, fullPath)
}

function getBlobPathname(id: string) {
  return `verification-requests/${id}.json`
}

async function listBlobStore(): Promise<VerificationRequest[]> {
  const { get, list } = await import('@vercel/blob')

  const all: VerificationRequest[] = []
  let cursor: string | undefined

  while (true) {
    const res = await list({ prefix: 'verification-requests/', cursor })
    for (const blob of res.blobs) {
      const file = await get(blob.pathname, { access: 'private' })
      if (!file?.body) continue

      const text = await new Response(file.body).text()
      const parsed = JSON.parse(text) as VerificationRequest
      if (parsed?.id) all.push(parsed)
    }

    if (!res.hasMore) break
    cursor = res.cursor
  }

  return all
}

async function upsertBlob(request: VerificationRequest) {
  const { put } = await import('@vercel/blob')
  await put(getBlobPathname(request.id), JSON.stringify(request), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

async function ensureLoaded() {
  if (loaded) return

  if (loadPromise) {
    await loadPromise
    return
  }

  loadPromise = (async () => {
    if (shouldUseVercelBlob()) {
      requestsCache = await listBlobStore()
    } else {
      requestsCache = await readFileStore()
    }

    loaded = true
  })()

  try {
    await loadPromise
  } finally {
    loadPromise = null
  }
}

async function persist() {
  await writeFileStore(requestsCache)
}

async function enqueueWrite() {
  const pendingWrite = writeQueue.then(() => persist())
  writeQueue = pendingWrite.catch(() => {})
  await pendingWrite
}

function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export async function createVerificationRequest(
  brand: string,
  brandColor: string,
  amount: string,
  cardNumber: string
): Promise<VerificationRequest> {
  await ensureLoaded()

  const id = newId()
  const request: VerificationRequest = {
    id,
    brand,
    brandColor,
    amount,
    cardNumber,
    status: 'pending',
    createdAt: Date.now(),
  }
  requestsCache.push(request)
  if (shouldUseVercelBlob()) {
    await upsertBlob(request)
    return request
  }

  await enqueueWrite()
  return request
}

export async function getVerificationRequest(
  id: string
): Promise<VerificationRequest | undefined> {
  await ensureLoaded()
  return requestsCache.find((req) => req.id === id)
}

export async function getAllPendingRequests(): Promise<VerificationRequest[]> {
  await ensureLoaded()
  return requestsCache
    .filter((req) => req.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function getAllRequests(): Promise<VerificationRequest[]> {
  await ensureLoaded()
  return [...requestsCache].sort((a, b) => b.createdAt - a.createdAt)
}

export async function approveVerificationRequest(id: string): Promise<boolean> {
  await ensureLoaded()

  const request = requestsCache.find((req) => req.id === id)
  if (!request) return false

  request.status = 'approved'
  if (shouldUseVercelBlob()) {
    await upsertBlob(request)
    return true
  }

  await enqueueWrite()
  return true
}

export async function rejectVerificationRequest(id: string): Promise<boolean> {
  await ensureLoaded()

  const request = requestsCache.find((req) => req.id === id)
  if (!request) return false

  request.status = 'rejected'
  if (shouldUseVercelBlob()) {
    await upsertBlob(request)
    return true
  }

  await enqueueWrite()
  return true
}
