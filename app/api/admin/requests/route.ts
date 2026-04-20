import { NextResponse } from 'next/server'
import { getAllRequests } from '@/lib/verification-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const requests = await getAllRequests()
    return NextResponse.json(
      { requests },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load requests' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
