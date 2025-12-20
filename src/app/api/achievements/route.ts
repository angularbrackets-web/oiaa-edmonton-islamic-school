import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
    }

    // Transform data to match the expected format
    const transformedData = {
      achievements: data.map((achievement: any) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        type: achievement.type,
        icon: achievement.icon,
        featured: achievement.featured,
        order: achievement.display_order,
        backgroundImage: achievement.background_image,
        ctaText: achievement.cta_text,
        ctaUrl: achievement.cta_url,
        ctaStyle: achievement.cta_style || 'primary'
      }))
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Single achievement creation
    if (body.achievement) {
      const achievement = body.achievement
      const { data, error } = await supabaseAdmin
        .from('achievements')
        .insert({
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          type: achievement.type,
          icon: achievement.icon,
          featured: achievement.featured,
          display_order: achievement.order,
          background_image: achievement.backgroundImage,
          cta_text: achievement.ctaText || null,
          cta_url: achievement.ctaUrl || null,
          cta_style: achievement.ctaStyle || 'primary'
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        achievement: {
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
      })
    }

    // Bulk replacement (existing behavior for reordering)
    if (body.achievements) {
      // Clear existing achievements first
      await supabaseAdmin.from('achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // Insert new achievements
      for (const achievement of body.achievements as any[]) {
        const { error } = await supabaseAdmin
          .from('achievements')
          .insert({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            type: achievement.type,
            icon: achievement.icon,
            featured: achievement.featured,
            display_order: achievement.order,
            background_image: achievement.backgroundImage,
            cta_text: achievement.ctaText || null,
            cta_url: achievement.ctaUrl || null,
            cta_style: achievement.ctaStyle || 'primary'
          })

        if (error) {
          console.error('Supabase error:', error)
          return NextResponse.json({ error: 'Failed to update achievements' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}