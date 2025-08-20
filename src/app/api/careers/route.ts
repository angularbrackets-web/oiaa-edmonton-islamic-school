import { NextResponse } from 'next/server'
import careersData from '@/data/careers.json'

export async function GET() {
  try {
    return NextResponse.json(careersData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load careers data' },
      { status: 500 }
    )
  }
}