/**
 * Component Usage API Route
 *
 * GET /api/components/[id]/usage - Get pages where this component is used
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/components/[id]/usage
 * Returns list of pages where this component is used
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: componentId } = await params
    const supabase = createClient()

    // Find all content_blocks with block_type='component' that reference this component
    const { data: blocks, error: blocksError } = await supabase
      .from('content_blocks')
      .select('id, page_id, display_order')
      .eq('block_type', 'component')

    if (blocksError) {
      throw new Error(`Failed to fetch blocks: ${blocksError.message}`)
    }

    // Filter blocks that have this component_id in their content
    const relevantBlocks = (blocks || []).filter(block => {
      try {
        // The content is already parsed as JSON by Supabase
        const content = block.content as any
        return content?.component_id === componentId
      } catch {
        return false
      }
    })

    if (relevantBlocks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          usage_count: 0,
          pages: []
        }
      })
    }

    // Get unique page IDs
    const pageIds = [...new Set(relevantBlocks.map(b => b.page_id))]

    // Fetch page details
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('id, title, slug, is_published')
      .in('id', pageIds)

    if (pagesError) {
      throw new Error(`Failed to fetch pages: ${pagesError.message}`)
    }

    // Map pages with block count
    const usageData = (pages || []).map(page => {
      const blockCount = relevantBlocks.filter(b => b.page_id === page.id).length
      return {
        page_id: page.id,
        page_title: page.title,
        page_slug: page.slug,
        is_published: page.is_published,
        block_count: blockCount
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        usage_count: relevantBlocks.length,
        pages: usageData
      }
    })
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/components/${id}/usage error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch component usage'
      },
      { status: 500 }
    )
  }
}
