import { NextResponse } from 'next/server'
import { approveVerificationRequest } from '@/lib/verification-store'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const success = await approveVerificationRequest(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to approve request' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
