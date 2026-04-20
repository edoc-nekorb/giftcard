import { NextResponse } from 'next/server'
import { getAllRequests } from '@/lib/verification-store'

export async function GET() {
  const requests = await getAllRequests()
  return NextResponse.json({ requests })
}
