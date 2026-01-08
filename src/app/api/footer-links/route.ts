import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Fetch footer links (optionally filtered by category)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const visibleOnly = searchParams.get('visible') !== 'false'

    let query = supabase
      .from('footer_links')
      .select('*')
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch footer links' },
        { status: 500 }
      )
    }

    // Group by category for easier consumption
    const grouped = (data || []).reduce((acc: Record<string, any[]>, link: any) => {
      if (!acc[link.category]) {
        acc[link.category] = []
      }
      acc[link.category].push(link)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data,
      grouped,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new footer link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { label, href, category, description, display_order, is_visible, is_external, open_in_new_tab } = body

    // Validation
    if (!label || !href || !category) {
      return NextResponse.json(
        { success: false, error: 'Label, href, and category are required' },
        { status: 400 }
      )
    }

    // Valid categories
    const validCategories = ['main', 'admissions', 'resources', 'support', 'legal']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('footer_links')
      .insert({
        label,
        href,
        category,
        description: description || null,
        display_order: display_order !== undefined ? display_order : 0,
        is_visible: is_visible !== undefined ? is_visible : true,
        is_external: is_external !== undefined ? is_external : false,
        open_in_new_tab: open_in_new_tab !== undefined ? open_in_new_tab : false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create footer link' },
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

// PUT - Update a footer link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, label, href, category, description, display_order, is_visible, is_external, open_in_new_tab } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (label !== undefined) updateData.label = label
    if (href !== undefined) updateData.href = href
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (display_order !== undefined) updateData.display_order = display_order
    if (is_visible !== undefined) updateData.is_visible = is_visible
    if (is_external !== undefined) updateData.is_external = is_external
    if (open_in_new_tab !== undefined) updateData.open_in_new_tab = open_in_new_tab

    const { data, error } = await supabaseAdmin
      .from('footer_links')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update footer link' },
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

// DELETE - Delete a footer link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('footer_links')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete footer link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Footer link deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Reorder footer links
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { links } = body // Array of { id, display_order }

    if (!Array.isArray(links) || links.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Links array is required' },
        { status: 400 }
      )
    }

    // Update each link's display_order
    const errors: string[] = []
    for (const link of links) {
      const { error } = await supabaseAdmin
        .from('footer_links')
        .update({ display_order: link.display_order })
        .eq('id', link.id)

      if (error) {
        errors.push(`${link.id}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Some links failed to update',
        details: errors
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Footer links reordered successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
