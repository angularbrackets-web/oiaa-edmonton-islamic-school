/**
 * Reusable Components API Routes
 *
 * GET /api/components - List all components (with optional filters)
 * POST /api/components - Create new component
 */

import { NextRequest, NextResponse } from 'next/server'
import { componentsService } from '@/lib/supabase/components'
import { ReusableComponentInput } from '@/types/cms'

/**
 * GET /api/components
 * Query params:
 * - category: Filter by category
 * - search: Search by name/description
 * - active: Filter by active status (true/false)
 * - include_instances: Include instance data (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const activeOnly = searchParams.get('active') === 'true'
    const includeInstances = searchParams.get('include_instances') === 'true'

    let components

    // Filter by search query
    if (search) {
      components = await componentsService.search(search)
    }
    // Filter by category
    else if (category) {
      components = await componentsService.getByCategory(category)
    }
    // Get active only
    else if (activeOnly) {
      components = await componentsService.getActive()
    }
    // Get all
    else {
      components = await componentsService.getAll(includeInstances)
    }

    return NextResponse.json({
      success: true,
      data: components,
      total: components.length
    })
  } catch (error) {
    console.error('GET /api/components error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch components'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/components
 * Create new component
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input: ReusableComponentInput = body

    const component = await componentsService.create(input)

    return NextResponse.json({
      success: true,
      data: component,
      message: 'Component created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/components error:', error)

    // Check if it's a validation error
    const errorMessage = error instanceof Error ? error.message : 'Failed to create component'
    const statusCode = errorMessage.includes('Validation failed') ? 400 : 500

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    )
  }
}
