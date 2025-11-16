/**
 * Content Blocks API Routes - Single Block Operations
 *
 * GET /api/blocks/[id] - Get single block
 * PUT /api/blocks/[id] - Update block
 * DELETE /api/blocks/[id] - Delete block
 * PATCH /api/blocks/[id] - Toggle visibility, duplicate
 */

import { NextRequest, NextResponse } from 'next/server'
import { blocksService } from '@/lib/supabase/pages'
import { ContentBlockInput } from '@/types/cms'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/blocks/[id]
 *
 * Get single block by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const block = await blocksService.getById(id)

    if (!block) {
      return NextResponse.json(
        {
          success: false,
          error: 'Block not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: block
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/blocks/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch block'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/blocks/[id]
 *
 * Update block
 *
 * Request Body: Partial<ContentBlockInput>
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const updates = await request.json() as Partial<ContentBlockInput>

    const block = await blocksService.update(id, updates)

    return NextResponse.json({
      success: true,
      data: block,
      message: 'Block updated successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/blocks/${id} error:`, error)

    // Handle not found
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update block'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/blocks/[id]
 *
 * Delete block
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    await blocksService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/blocks/${id} error:`, error)

    // Handle not found
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete block'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/blocks/[id]
 *
 * Perform actions on block
 *
 * Query Parameters:
 * - action: toggle_visibility | duplicate
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'toggle_visibility': {
        const block = await blocksService.toggleVisibility(id)
        return NextResponse.json({
          success: true,
          data: block,
          message: `Block ${block.is_visible ? 'shown' : 'hidden'}`
        })
      }

      case 'duplicate': {
        const block = await blocksService.duplicate(id)
        return NextResponse.json({
          success: true,
          data: block,
          message: 'Block duplicated successfully'
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action. Supported actions: toggle_visibility, duplicate'
          },
          { status: 400 }
        )
    }
  } catch (error) {
    const { id } = await params
    console.error(`PATCH /api/blocks/${id} error:`, error)

    // Handle not found
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process request'
      },
      { status: 500 }
    )
  }
}
