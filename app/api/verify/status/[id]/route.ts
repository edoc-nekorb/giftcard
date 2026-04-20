import { NextResponse } from 'next/server'
import { getVerificationRequest } from '@/lib/verification-store'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const verificationRequest = await getVerificationRequest(id)

  if (!verificationRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: verificationRequest.id,
    status: verificationRequest.status,
    brand: verificationRequest.brand,
  })
}
