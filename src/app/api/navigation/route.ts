/**
 * Navigation API Routes - Collection Operations
 *
 * GET /api/navigation - Get all navigation items or filtered results
 * POST /api/navigation - Create new navigation item
 */

import { NextRequest, NextResponse } from 'next/server'
import { navigationService } from '@/lib/supabase/navigation'
import { NavigationItemInput, NavigationQueryFilters } from '@/types/navigation'

/**
 * GET /api/navigation
 *
 * Query Parameters:
 * - visible: boolean - Filter by visibility
 * - featured: boolean - Filter by featured status
 * - level: 1 | 2 - Filter by menu level
 * - parent_id: string - Filter by parent ID
 * - tree: boolean - Return hierarchical tree structure
 * - admin: boolean - Include hidden items (use with tree=true for admin management)
 * - orderBy: string - Sort field (display_order, label_en, created_at)
 * - orderDirection: asc | desc - Sort direction
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Check if tree structure is requested
    const wantsTree = searchParams.get('tree') === 'true'
    const isAdmin = searchParams.get('admin') === 'true'

    if (wantsTree) {
      // Use admin tree if admin flag is set (includes hidden items)
      const tree = isAdmin
        ? await navigationService.getAdminNavigationTree()
        : await navigationService.getNavigationTree()
      return NextResponse.json({
        success: true,
        data: tree
      })
    }

    // Build filters from query parameters
    const filters: NavigationQueryFilters = {}

    const visible = searchParams.get('visible')
    if (visible !== null) {
      filters.is_visible = visible === 'true'
    }

    const featured = searchParams.get('featured')
    if (featured !== null) {
      filters.is_featured = featured === 'true'
    }

    const level = searchParams.get('level')
    if (level) {
      filters.level = parseInt(level) as 1 | 2
    }

    const parentId = searchParams.get('parent_id')
    if (parentId !== null) {
      filters.parent_id = parentId === 'null' ? null : parentId
    }

    const orderBy = searchParams.get('orderBy')
    if (orderBy) {
      filters.orderBy = orderBy as 'display_order' | 'label_en' | 'created_at'
    }

    const orderDirection = searchParams.get('orderDirection')
    if (orderDirection) {
      filters.orderDirection = orderDirection as 'asc' | 'desc'
    }

    // Fetch with filters
    const items = await navigationService.getFiltered(filters)

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    })
  } catch (error) {
    console.error('GET /api/navigation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch navigation items'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/navigation
 *
 * Create new navigation item
 *
 * Request Body: NavigationItemInput
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as NavigationItemInput

    // Validate required fields
    if (!body.label_en || !body.href || !body.level) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: label_en, href, level'
        },
        { status: 400 }
      )
    }

    // Create navigation item
    const item = await navigationService.create(body)

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: 'Navigation item created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/navigation error:', error)

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

    // Handle duplicate href errors
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
        error: error instanceof Error ? error.message : 'Failed to create navigation item'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/navigation (Bulk Operations)
 *
 * Bulk update multiple navigation items
 *
 * Request Body:
 * {
 *   item_ids: string[],
 *   updates: Partial<NavigationItemInput>
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { item_ids, updates } = body

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'item_ids array is required'
        },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'updates object is required'
        },
        { status: 400 }
      )
    }

    await navigationService.bulkUpdate(item_ids, updates)

    return NextResponse.json({
      success: true,
      message: `${item_ids.length} navigation items updated successfully`
    })
  } catch (error) {
    console.error('PUT /api/navigation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to bulk update navigation items'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/navigation/reorder
 *
 * Reorder navigation items
 *
 * Request Body:
 * {
 *   item_ids: string[],
 *   new_orders: number[]
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'reorder') {
      const body = await request.json()
      const { item_ids, new_orders } = body

      if (!item_ids || !new_orders) {
        return NextResponse.json(
          {
            success: false,
            error: 'item_ids and new_orders are required'
          },
          { status: 400 }
        )
      }

      await navigationService.reorder(item_ids, new_orders)

      return NextResponse.json({
        success: true,
        message: 'Navigation items reordered successfully'
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unknown action'
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('PATCH /api/navigation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process request'
      },
      { status: 500 }
    )
  }
}
