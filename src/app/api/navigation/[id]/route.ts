/**
 * Navigation API Routes - Single Item Operations
 *
 * GET /api/navigation/[id] - Get single navigation item
 * PUT /api/navigation/[id] - Update navigation item
 * DELETE /api/navigation/[id] - Delete navigation item
 * PATCH /api/navigation/[id] - Toggle visibility or other actions
 */

import { NextRequest, NextResponse } from 'next/server'
import { navigationService } from '@/lib/supabase/navigation'
import { NavigationItemInput } from '@/types/navigation'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/navigation/[id]
 *
 * Get single navigation item by ID
 *
 * Query Parameters:
 * - include_children: boolean - Include child items
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeChildren = searchParams.get('include_children') === 'true'

    const item = await navigationService.getById(id)

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Navigation item not found'
        },
        { status: 404 }
      )
    }

    // If include_children requested and item is top-level, fetch children
    let response: any = { success: true, data: item }

    if (includeChildren && item.level === 1) {
      const children = await navigationService.getChildren(id, false)
      response.data = {
        ...item,
        children
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/navigation/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch navigation item'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/navigation/[id]
 *
 * Update navigation item
 *
 * Request Body: Partial<NavigationItemInput>
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const updates = await request.json() as Partial<NavigationItemInput>

    // Prevent updating ID
    if ('id' in updates) {
      delete updates.id
    }

    // Prevent updating timestamps
    if ('created_at' in updates || 'updated_at' in updates) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot update timestamps'
        },
        { status: 400 }
      )
    }

    const item = await navigationService.update(id, updates)

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Navigation item updated successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/navigation/${id} error:`, error)

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

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update navigation item'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/navigation/[id]
 *
 * Delete navigation item (and its children via CASCADE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    await navigationService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Navigation item deleted successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/navigation/${id} error:`, error)

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
        error: error instanceof Error ? error.message : 'Failed to delete navigation item'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/navigation/[id]
 *
 * Perform actions on navigation item
 *
 * Query Parameters:
 * - action: toggle_visibility
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
        const item = await navigationService.toggleVisibility(id)
        return NextResponse.json({
          success: true,
          data: item,
          message: `Navigation item ${item.is_visible ? 'shown' : 'hidden'}`
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action. Supported actions: toggle_visibility'
          },
          { status: 400 }
        )
    }
  } catch (error) {
    const { id } = await params
    console.error(`PATCH /api/navigation/${id} error:`, error)

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
