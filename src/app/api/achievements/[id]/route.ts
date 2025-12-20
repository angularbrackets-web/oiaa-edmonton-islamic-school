import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET single achievement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    const transformedData = {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      type: data.type,
      icon: data.icon,
      featured: data.featured,
      order: data.display_order,
      backgroundImage: data.background_image,
      ctaText: data.cta_text,
      ctaUrl: data.cta_url,
      ctaStyle: data.cta_style || 'primary'
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE single achievement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}

    // Map frontend field names to database field names
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.date !== undefined) updateData.date = body.date
    if (body.type !== undefined) updateData.type = body.type
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.featured !== undefined) updateData.featured = body.featured
    if (body.order !== undefined) updateData.display_order = body.order
    if (body.backgroundImage !== undefined) updateData.background_image = body.backgroundImage
    if (body.ctaText !== undefined) updateData.cta_text = body.ctaText
    if (body.ctaUrl !== undefined) updateData.cta_url = body.ctaUrl
    if (body.ctaStyle !== undefined) updateData.cta_style = body.ctaStyle

    const { data, error } = await supabaseAdmin
      .from('achievements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
    }

    const transformedData = {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      type: data.type,
      icon: data.icon,
      featured: data.featured,
      order: data.display_order,
      backgroundImage: data.background_image,
      ctaText: data.cta_text,
      ctaUrl: data.cta_url,
      ctaStyle: data.cta_style || 'primary'
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE single achievement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('achievements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Achievement deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
