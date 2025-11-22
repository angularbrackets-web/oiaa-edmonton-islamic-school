import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Temporary debug endpoint to check media table
export async function GET() {
  try {
    // Get ALL media records
    const { data: allMedia, error: allError } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      return NextResponse.json({
        error: 'Failed to fetch all media',
        details: allError
      }, { status: 500 })
    }

    // Get latest 10 media records
    const { data: latestMedia, error: latestError } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (latestError) {
      return NextResponse.json({
        error: 'Failed to fetch latest media',
        details: latestError
      }, { status: 500 })
    }

    // Group by folder
    const byFolder = allMedia?.reduce((acc: any, item: any) => {
      const folder = item.folder || 'no-folder'
      if (!acc[folder]) acc[folder] = []
      acc[folder].push({
        id: item.id,
        url: item.url,
        created_at: item.created_at,
        file_type: item.file_type
      })
      return acc
    }, {})

    return NextResponse.json({
      totalCount: allMedia?.length || 0,
      byFolder,
      latestTen: latestMedia?.map((m: any) => ({
        id: m.id,
        url: m.url,
        folder: m.folder,
        file_type: m.file_type,
        created_at: m.created_at,
        public_id: m.public_id
      })),
      message: 'All media grouped by folder + latest 10'
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
