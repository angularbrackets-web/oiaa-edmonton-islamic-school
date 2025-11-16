/**
 * Media by ID API Routes
 *
 * GET /api/media/[id] - Get media by ID
 * PUT /api/media/[id] - Update media
 * DELETE /api/media/[id] - Delete media
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/media/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('media_library')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Media not found' },
          { status: 404 }
        )
      }
      throw new Error(`Failed to fetch media: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/media/${id} error:`, error)
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
 * PUT /api/media/[id]
 * Update media metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { alt_text, caption, title, tags } = body

    const { data, error } = await supabaseAdmin
      .from('media_library')
      .update({
        alt_text: alt_text || null,
        caption: caption || null,
        title: title || null,
        tags: tags || null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update media: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Media updated successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/media/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update media'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/media/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check usage count first
    const { data: media } = await supabaseAdmin
      .from('media_library')
      .select('usage_count')
      .eq('id', id)
      .single()

    if (media && media.usage_count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete media that is in use (${media.usage_count} usage(s))`
        },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('media_library')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete media: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/media/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete media'
      },
      { status: 500 }
    )
  }
}
