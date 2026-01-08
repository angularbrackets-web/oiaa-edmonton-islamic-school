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
 * - page_id: string - Get blocks for specific page
 * - component_id: string - Get blocks for specific component
 * - admin: boolean - Include hidden blocks
 *
 * Note: Either page_id OR component_id must be provided (not both)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')
    const componentId = searchParams.get('component_id')
    const admin = searchParams.get('admin') === 'true'

    // Validate that exactly one parent is provided
    if (!pageId && !componentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either page_id or component_id query parameter is required'
        },
        { status: 400 }
      )
    }

    if (pageId && componentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot specify both page_id and component_id'
        },
        { status: 400 }
      )
    }

    // Fetch blocks based on parent type
    let blocks: any[]
    if (pageId) {
      blocks = admin
        ? await blocksService.getByPageIdAdmin(pageId)
        : await blocksService.getByPageId(pageId)
    } else {
      blocks = admin
        ? await blocksService.getByComponentIdAdmin(componentId!)
        : await blocksService.getByComponentId(componentId!)
    }

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
 * Request Body: ContentBlockInput (with either page_id OR component_id)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContentBlockInput

    // Validate required fields
    if (!body.block_type || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: block_type, content'
        },
        { status: 400 }
      )
    }

    // Validate that exactly one parent is provided
    const hasPageId = !!body.page_id
    const hasComponentId = !!(body as any).component_id

    if (!hasPageId && !hasComponentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either page_id or component_id is required'
        },
        { status: 400 }
      )
    }

    if (hasPageId && hasComponentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot specify both page_id and component_id'
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
