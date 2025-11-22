import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Temporary debug endpoint to check media table
export async function GET() {
  try {
    // Get latest 5 media records
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (mediaError) {
      return NextResponse.json({
        error: 'Failed to fetch media',
        details: mediaError
      }, { status: 500 })
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      totalCount: count,
      latestMedia: media,
      message: 'Debug info - latest 5 media records'
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
