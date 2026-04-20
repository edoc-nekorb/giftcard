import { NextResponse } from 'next/server'
import { getVerificationRequest } from '@/lib/verification-store'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const verificationRequest = await getVerificationRequest(id)

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      {
        id: verificationRequest.id,
        status: verificationRequest.status,
        brand: verificationRequest.brand,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load status' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
