/**
 * Component by ID API Routes
 *
 * GET /api/components/[id] - Get component by ID
 * PUT /api/components/[id] - Update component
 * DELETE /api/components/[id] - Delete component
 */

import { NextRequest, NextResponse } from 'next/server'
import { componentsService } from '@/lib/supabase/components'
import { ReusableComponentInput } from '@/types/cms'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/components/[id]
 * Query params:
 * - include_instances: Include instance data (true/false)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const includeInstances = searchParams.get('include_instances') === 'true'

    const component = await componentsService.getById(id, includeInstances)

    if (!component) {
      return NextResponse.json(
        {
          success: false,
          error: 'Component not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: component
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/components/${id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch component'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/components/[id]
 * Update component
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates: Partial<ReusableComponentInput> = body

    const component = await componentsService.update(id, updates)

    return NextResponse.json({
      success: true,
      data: component,
      message: 'Component updated successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/components/${id} error:`, error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to update component'
    const statusCode = errorMessage.includes('not found') ? 404 :
                       errorMessage.includes('Validation failed') ? 400 : 500

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    )
  }
}

/**
 * DELETE /api/components/[id]
 * Delete component (will cascade delete all instances)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    await componentsService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Component deleted successfully'
    })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/components/${id} error:`, error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to delete component'
    const statusCode = errorMessage.includes('not found') ? 404 : 500

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    )
  }
}
