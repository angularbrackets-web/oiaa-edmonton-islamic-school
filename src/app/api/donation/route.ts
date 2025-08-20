import { NextResponse } from 'next/server'
import donationData from '@/data/donation.json'

export async function GET() {
  try {
    return NextResponse.json(donationData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load donation data' },
      { status: 500 }
    )
  }
}