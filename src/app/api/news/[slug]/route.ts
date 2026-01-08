import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch a single news article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Fetch the article by slug
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Database error:', error)

      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Article not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch article' },
        { status: 500 }
      )
    }

    // Transform the data
    const article = {
      ...data,
      author: data.author || 'Admin',
      featured_image: data.featured_image || data.image_url || null
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
