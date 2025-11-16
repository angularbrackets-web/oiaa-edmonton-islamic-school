/**
 * Component Instances Management API
 *
 * POST /api/component-instances - Create new component instance
 */

import { NextRequest, NextResponse } from 'next/server'
import { componentsService } from '@/lib/supabase/components'
import { ComponentInstanceInput } from '@/types/cms'

/**
 * POST /api/component-instances
 * Insert component into a page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input: ComponentInstanceInput = body

    const instance = await componentsService.createInstance(input)

    return NextResponse.json({
      success: true,
      data: instance,
      message: 'Component inserted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/component-instances error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to create instance'
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
