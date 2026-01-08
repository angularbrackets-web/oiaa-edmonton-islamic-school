import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Fetch a single news article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    console.log('[News API] Fetching article with slug:', slug)

    if (!slug) {
      console.log('[News API] No slug provided')
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS
    const client = supabaseAdmin || supabase

    // Fetch the article by slug
    const { data, error } = await client
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('[News API] Database error for slug:', slug, error)

      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        console.log('[News API] Article not found with slug:', slug)
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

    if (!data) {
      console.log('[News API] No data returned for slug:', slug)
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    console.log('[News API] Successfully fetched article:', data.title)

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
