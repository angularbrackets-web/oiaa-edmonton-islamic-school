import { NextResponse } from 'next/server'
import news from '@/data/news.json'

export async function GET() {
  return NextResponse.json(news)
}