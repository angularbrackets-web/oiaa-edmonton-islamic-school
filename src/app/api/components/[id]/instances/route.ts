/**
 * Component Instances API Routes
 *
 * GET /api/components/[id]/instances - Get all instances of a component
 */

import { NextRequest, NextResponse } from 'next/server'
import { componentsService } from '@/lib/supabase/components'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/components/[id]/instances
 * Get all instances of a component with usage statistics
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check if component exists
    const component = await componentsService.getById(id)
    if (!component) {
      return NextResponse.json(
        {
          success: false,
          error: 'Component not found'
        },
        { status: 404 }
      )
    }

    // Get instances and usage stats
    const [instances, usageStats] = await Promise.all([
      componentsService.getInstancesByComponent(id),
      componentsService.getUsageStats(id)
    ])

    return NextResponse.json({
      success: true,
      data: {
        component,
        instances,
        usage_stats: usageStats
      }
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/components/${id}/instances error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch instances'
      },
      { status: 500 }
    )
  }
}
