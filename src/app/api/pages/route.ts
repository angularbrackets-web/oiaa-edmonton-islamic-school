/**
 * Pages API Routes - Collection Operations
 *
 * GET /api/pages - Get all pages or filtered results
 * POST /api/pages - Create new page
 */

import { NextRequest, NextResponse } from 'next/server'
import { pagesService } from '@/lib/supabase/pages'
import { PageInput } from '@/types/cms'

/**
 * GET /api/pages
 *
 * Query Parameters:
 * - published: boolean - Filter by published status
 * - reusable: boolean - Filter by reusable status (for page embedding)
 * - include_blocks: boolean - Include content blocks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const publishedOnly = searchParams.get('published') === 'true'
    const reusableOnly = searchParams.get('reusable') === 'true'
    const includeBlocks = searchParams.get('include_blocks') === 'true'

    let pages
    if (reusableOnly) {
      pages = await pagesService.getReusable(includeBlocks)
    } else if (publishedOnly) {
      pages = await pagesService.getPublished()
    } else {
      pages = await pagesService.getAll(includeBlocks)
    }

    return NextResponse.json({
      success: true,
      data: pages,
      count: pages.length
    })
  } catch (error) {
    console.error('GET /api/pages error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pages'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pages
 *
 * Create new page
 *
 * Request Body: PageInput
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PageInput

    // Validate required fields
    if (!body.slug || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: slug, title'
        },
        { status: 400 }
      )
    }

    // Create page
    const page = await pagesService.create(body)

    return NextResponse.json(
      {
        success: true,
        data: page,
        message: 'Page created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/pages error:', error)

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

    // Handle duplicate slug errors
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
        error: error instanceof Error ? error.message : 'Failed to create page'
      },
      { status: 500 }
    )
  }
}
