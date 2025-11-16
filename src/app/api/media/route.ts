/**
 * Media Library API Routes
 *
 * GET /api/media - Get all media files
 * POST /api/media - Create new media entry
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/media
 * Query params:
 * - type: Filter by type (image, video, document)
 * - search: Search by filename or title
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    let query = supabaseAdmin
      .from('media_library')
      .select('*')
      .order('uploaded_at', { ascending: false })

    // Filter by type
    if (type) {
      query = query.eq('type', type)
    }

    // Search by filename or title
    if (search) {
      query = query.or(`filename.ilike.%${search}%,title.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch media: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
  } catch (error) {
    console.error('GET /api/media error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch media'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/media
 * Create new media entry (after Cloudinary upload)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      filename,
      original_filename,
      url,
      type,
      mime_type,
      size_bytes,
      width,
      height,
      alt_text,
      caption,
      title,
      folder,
      tags
    } = body

    // Validate required fields
    if (!filename || !url || !type || !mime_type || !size_bytes) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: filename, url, type, mime_type, size_bytes'
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('media_library')
      .insert({
        filename,
        original_filename: original_filename || filename,
        url,
        type,
        mime_type,
        size_bytes,
        width: width || null,
        height: height || null,
        alt_text: alt_text || null,
        caption: caption || null,
        title: title || null,
        folder: folder || 'uploads',
        tags: tags || null,
        usage_count: 0
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create media: ${error.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Media created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/media error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create media'
      },
      { status: 500 }
    )
  }
}
