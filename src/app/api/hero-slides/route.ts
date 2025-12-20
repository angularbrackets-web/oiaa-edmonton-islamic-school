import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Fetch all hero slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hero slides' },
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

// POST - Create new slide or reorder slides
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if this is a reorder request
    if (body.slides && Array.isArray(body.slides)) {
      // Reorder slides (bulk update of display_order)
      for (const slide of body.slides) {
        const { error } = await supabaseAdmin
          .from('hero_slides')
          .update({ display_order: slide.display_order })
          .eq('id', slide.id)

        if (error) {
          console.error('Database error:', error)
          return NextResponse.json(
            { success: false, error: 'Failed to update slide order' },
            { status: 500 }
          )
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Slide order updated successfully'
      })
    } else {
      // Create new slide
      // Get max display_order
      const { data: existingSlides } = await supabase
        .from('hero_slides')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)

      const maxOrder = existingSlides?.[0]?.display_order ?? -1

      const newSlide = {
        title: body.title || '',
        subtitle: body.subtitle || '',
        description: body.description || '',
        slide_type: body.slide_type || 'image_text',
        background_image: body.background_image || '',
        background_color: body.background_color || '#145B55',
        background_overlay: body.background_overlay ?? true,
        overlay_opacity: body.overlay_opacity ?? 0.5,
        text_color: body.text_color || 'white',
        text_alignment: body.text_alignment || 'center',
        cta_text: body.cta_text || '',
        cta_link: body.cta_link || '',
        cta_style: body.cta_style || 'primary',
        cta2_text: body.cta2_text || '',
        cta2_link: body.cta2_link || '',
        cta2_style: body.cta2_style || 'secondary',
        display_order: maxOrder + 1,
        duration: body.duration || 5000,
        is_active: body.is_active ?? true
      }

      const { data, error } = await supabaseAdmin
        .from('hero_slides')
        .insert(newSlide)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to create slide' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Slide created successfully'
      })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
