import { NextResponse } from 'next/server'
import { createVerificationRequest } from '@/lib/verification-store'

export async function POST(request: Request) {
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

  return NextResponse.json({ id: verificationRequest.id })
}
