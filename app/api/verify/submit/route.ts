import { NextResponse } from 'next/server'
import { createVerificationRequest } from '@/lib/verification-store'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { brand, brandColor, amount, cardNumber } = body

    if (!brand || !amount || !cardNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const verificationRequest = await createVerificationRequest(
      brand,
      brandColor || '#000',
      amount,
      cardNumber
    )

    return NextResponse.json(
      { id: verificationRequest.id },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to submit request' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
