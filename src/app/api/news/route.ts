import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const admin = searchParams.get('admin')

    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    // Only filter by published status if not in admin mode
    if (admin !== 'true') {
      query = query.eq('published', true)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch news from database' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ news: [] })
    }

    // Transform data to match the expected format
    const transformedData = {
      news: data.map(article => ({
        id: article.id,
        title: article.title,
        arabic_title: article.arabic_title || null,
        slug: article.slug || (article.title ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : article.id),
        excerpt: article.excerpt,
        content: article.content,
        featured_image: article.featured_image || article.image_url || null,
        category: article.category || 'general',
        tags: article.tags || [],
        author: article.author || 'Admin',
        featured: article.featured || false,
        published: article.published !== false,
        publish_date: article.publish_date || article.created_at,
        created_at: article.created_at,
        updated_at: article.updated_at
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
    
    // Generate slug from title if not provided
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Create new article with only basic fields
    const insertData: any = {
      title: body.title,
      content: body.content
    }

    // Add optional basic fields one by one
    if (body.category) insertData.category = body.category
    if (body.author) insertData.author = body.author
    if (typeof body.featured === 'boolean') insertData.featured = body.featured
    if (typeof body.published === 'boolean') insertData.published = body.published

    const { error } = await supabase
      .from('news')
      .insert(insertData)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    // Build update object with only basic fields
    const updateObject: any = {}

    // Add fields that should exist
    if (updateData.title !== undefined) updateObject.title = updateData.title
    if (updateData.content !== undefined) updateObject.content = updateData.content
    if (updateData.category !== undefined) updateObject.category = updateData.category
    if (updateData.author !== undefined) updateObject.author = updateData.author || null
    if (typeof updateData.featured === 'boolean') updateObject.featured = updateData.featured
    if (typeof updateData.published === 'boolean') updateObject.published = updateData.published

    const { error } = await supabase
      .from('news')
      .update(updateObject)
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}