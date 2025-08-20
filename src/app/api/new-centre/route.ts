import { NextResponse } from 'next/server'
import newCentreData from '@/data/new-centre.json'

export async function GET() {
  try {
    return NextResponse.json(newCentreData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load new centre data' },
      { status: 500 }
    )
  }
}