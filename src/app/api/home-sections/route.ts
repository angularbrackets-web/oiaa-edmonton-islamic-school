import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// Disable caching for this API route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Fetch all home sections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible_only') === 'true'

    let query = supabase
      .from('home_sections')
      .select('*')
      .order('display_order', { ascending: true })

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch home sections' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new section or reorder sections
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if this is a reorder request or create request
    if (body.sections && Array.isArray(body.sections)) {
      // Reorder sections (bulk update of display_order)
      for (const section of body.sections) {
        const { error } = await supabaseAdmin
          .from('home_sections')
          .update({ display_order: section.display_order })
          .eq('id', section.id)

        if (error) {
          console.error('Database error:', error)
          return NextResponse.json(
            { success: false, error: 'Failed to update section order' },
            { status: 500 }
          )
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Section order updated successfully'
      })
    } else if (body.section_name) {
      // Create new section
      // Get max display_order
      const { data: existingSections } = await supabase
        .from('home_sections')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)

      const maxOrder = existingSections?.[0]?.display_order ?? -1

      const newSection: any = {
        section_name: body.section_name,
        section_type: body.section_type,
        display_order: maxOrder + 1,
        is_visible: body.is_visible ?? true,
        config: body.config || {}
      }

      // Add component_id if provided (new component-based approach)
      if (body.component_id) {
        newSection.component_id = body.component_id
        newSection.section_id = null // Don't use section_id for component-based sections
      } else {
        // Legacy section_id approach
        newSection.section_id = body.section_id || body.section_type.toLowerCase()
        newSection.component_id = null
      }

      const { data, error } = await supabaseAdmin
        .from('home_sections')
        .insert(newSection)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to create section' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Section created successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
