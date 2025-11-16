/**
 * Content Blocks API Routes
 *
 * GET /api/blocks - Get blocks (by page_id)
 * POST /api/blocks - Create new block
 * PUT /api/blocks - Reorder blocks
 */

import { NextRequest, NextResponse } from 'next/server'
import { blocksService } from '@/lib/supabase/pages'
import { ContentBlockInput } from '@/types/cms'

/**
 * GET /api/blocks
 *
 * Query Parameters:
 * - page_id: string (required) - Get blocks for specific page
 * - admin: boolean - Include hidden blocks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')
    const admin = searchParams.get('admin') === 'true'

    if (!pageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'page_id query parameter is required'
        },
        { status: 400 }
      )
    }

    const blocks = admin
      ? await blocksService.getByPageIdAdmin(pageId)
      : await blocksService.getByPageId(pageId)

    return NextResponse.json({
      success: true,
      data: blocks,
      count: blocks.length
    })
  } catch (error) {
    console.error('GET /api/blocks error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blocks'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blocks
 *
 * Create new block
 *
 * Request Body: ContentBlockInput
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContentBlockInput

    // Validate required fields
    if (!body.page_id || !body.block_type || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: page_id, block_type, content'
        },
        { status: 400 }
      )
    }

    // Create block
    const block = await blocksService.create(body)

    return NextResponse.json(
      {
        success: true,
        data: block,
        message: 'Block created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/blocks error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create block'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/blocks
 *
 * Reorder blocks
 *
 * Request Body:
 * {
 *   block_ids: string[],
 *   new_orders: number[]
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { block_ids, new_orders } = body

    if (!block_ids || !Array.isArray(block_ids) || block_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'block_ids array is required'
        },
        { status: 400 }
      )
    }

    if (!new_orders || !Array.isArray(new_orders)) {
      return NextResponse.json(
        {
          success: false,
          error: 'new_orders array is required'
        },
        { status: 400 }
      )
    }

    await blocksService.reorder(block_ids, new_orders)

    return NextResponse.json({
      success: true,
      message: 'Blocks reordered successfully'
    })
  } catch (error) {
    console.error('PUT /api/blocks error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reorder blocks'
      },
      { status: 500 }
    )
  }
}
