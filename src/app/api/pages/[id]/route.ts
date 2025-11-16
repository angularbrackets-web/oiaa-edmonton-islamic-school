/**
 * Pages API Routes - Single Page Operations
 *
 * GET /api/pages/[id] - Get single page by ID or slug
 * PUT /api/pages/[id] - Update page
 * DELETE /api/pages/[id] - Delete page
 * PATCH /api/pages/[id] - Toggle publish status, duplicate
 */

import { NextRequest, NextResponse } from 'next/server'
import { pagesService } from '@/lib/supabase/pages'
import { PageInput } from '@/types/cms'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/pages/[id]
 *
 * Get single page by ID or slug
 *
 * Query Parameters:
 * - include_blocks: boolean - Include content blocks
 * - by_slug: boolean - Treat ID as slug instead of UUID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeBlocks = searchParams.get('include_blocks') === 'true'
    const bySlug = searchParams.get('by_slug') === 'true'

    const page = bySlug
      ? await pagesService.getBySlug(id, false)
      : await pagesService.getById(id, includeBlocks)

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/pages/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch page'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/pages/[id]
 *
 * Update page
 *
 * Request Body: Partial<PageInput>
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const updates = await request.json() as Partial<PageInput>

    const page = await pagesService.update(id, updates)

    return NextResponse.json({
      success: true,
      data: page,
      message: 'Page updated successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/pages/${id} error:`, error)

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

    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 400 }
      )
    }

    // Handle duplicate slug
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update page'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pages/[id]
 *
 * Delete page (and all its blocks via CASCADE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    await pagesService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/pages/${id} error:`, error)

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
        error: error instanceof Error ? error.message : 'Failed to delete page'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/pages/[id]
 *
 * Perform actions on page
 *
 * Query Parameters:
 * - action: toggle_publish | duplicate
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
      case 'toggle_publish': {
        const page = await pagesService.togglePublish(id)
        return NextResponse.json({
          success: true,
          data: page,
          message: `Page ${page.is_published ? 'published' : 'unpublished'}`
        })
      }

      case 'duplicate': {
        const page = await pagesService.duplicate(id)
        return NextResponse.json({
          success: true,
          data: page,
          message: 'Page duplicated successfully'
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action. Supported actions: toggle_publish, duplicate'
          },
          { status: 400 }
        )
    }
  } catch (error) {
    const { id } = await params
    console.error(`PATCH /api/pages/${id} error:`, error)

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
