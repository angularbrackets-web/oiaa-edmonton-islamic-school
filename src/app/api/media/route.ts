import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all' // 'image', 'video', 'all'
    const folder = searchParams.get('folder') || ''
    const sort = searchParams.get('sort') || 'newest' // 'newest', 'oldest'

    const offset = (page - 1) * limit

    // Build query (using admin client to bypass RLS)
    let query = supabaseAdmin
      .from('media')
      .select('*', { count: 'exact' })

    // Apply search filter (search in alt text and public_id)
    if (search) {
      query = query.or(`alt.ilike.%${search}%,public_id.ilike.%${search}%`)
    }

    // Apply type filter
    if (type !== 'all') {
      query = query.eq('file_type', type)
    }

    // Apply folder filter
    if (folder) {
      query = query.eq('folder', folder)
    }

    // Apply sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: true })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching media:', error)
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }

    console.log('Media API query:', {
      page,
      limit,
      search,
      type,
      folder,
      sort,
      resultCount: data?.length,
      totalCount: count
    })

    return NextResponse.json({
      media: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
