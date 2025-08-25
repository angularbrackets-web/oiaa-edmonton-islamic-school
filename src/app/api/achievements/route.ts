import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
      achievements: data.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        type: achievement.type,
        icon: achievement.icon,
        featured: achievement.featured,
        order: achievement.display_order,
        backgroundImage: achievement.background_image
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
    
    if (body.achievements) {
      // Clear existing achievements first
      await supabase.from('achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // Insert new achievements
      for (const achievement of body.achievements) {
        const { error } = await supabase
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
            background_image: achievement.backgroundImage
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