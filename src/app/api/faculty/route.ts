import { NextResponse } from 'next/server'
import facultyData from '@/data/faculty.json'

export async function GET() {
  try {
    return NextResponse.json(facultyData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load faculty data' },
      { status: 500 }
    )
  }
}