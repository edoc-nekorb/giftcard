import { NextResponse } from 'next/server'
import { rejectVerificationRequest } from '@/lib/verification-store'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const success = await rejectVerificationRequest(id)

  if (!success) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
