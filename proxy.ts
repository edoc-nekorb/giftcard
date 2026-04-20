import { NextResponse, type NextRequest } from 'next/server'

function parseBasicAuth(headerValue: string | null) {
  if (!headerValue) return null
  const [scheme, encoded] = headerValue.split(' ')
  if (scheme !== 'Basic' || !encoded) return null

  try {
    const decoded = atob(encoded)
    const separatorIndex = decoded.indexOf(':')
    if (separatorIndex < 0) return null
    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"',
    },
  })
}

function isAuthorized(request: NextRequest) {
  const username = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASS

  if (!username || !password) return false

  const auth = parseBasicAuth(request.headers.get('authorization'))
  if (!auth) return false
  return auth.username === username && auth.password === password
}

export function proxy(request: NextRequest) {
  const adminPath = (process.env.ADMIN_PATH || 'control-center').replace(/^\/+/, '')
  const publicAdminPrefix = `/${adminPath}`

  const { pathname } = request.nextUrl

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (pathname === publicAdminPrefix || pathname.startsWith(`${publicAdminPrefix}/`)) {
    if (!isAuthorized(request)) return unauthorized()

    const url = request.nextUrl.clone()
    url.pathname = '/admin' + pathname.slice(publicAdminPrefix.length)
    return NextResponse.rewrite(url)
  }

  if (pathname === '/api/admin' || pathname.startsWith('/api/admin/')) {
    if (!isAuthorized(request)) return unauthorized()
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
