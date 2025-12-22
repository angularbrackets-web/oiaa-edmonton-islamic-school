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
      news: data.map((article: any) => ({
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

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Generate slug from title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Generate unique slug by checking for duplicates
    const getUniqueSlug = async (baseSlug: string): Promise<string> => {
      let slug = baseSlug
      let counter = 2

      while (true) {
        // Check if slug exists
        const { data, error } = await supabase
          .from('news')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (error) {
          console.error('Error checking slug:', error)
          throw error
        }

        // If slug doesn't exist, we can use it
        if (!data) {
          return slug
        }

        // If slug exists, try with counter
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Get unique slug
    const baseSlug = body.slug || generateSlug(body.title)
    const uniqueSlug = await getUniqueSlug(baseSlug)

    // Create new article with all fields
    const insertData: any = {
      title: body.title,
      content: body.content,
      slug: uniqueSlug
    }

    // Add optional fields
    if (body.arabic_title) insertData.arabic_title = body.arabic_title
    if (body.excerpt) insertData.excerpt = body.excerpt
    if (body.featured_image) insertData.featured_image = body.featured_image
    if (body.category) insertData.category = body.category
    if (body.tags && Array.isArray(body.tags)) insertData.tags = body.tags
    if (body.author) insertData.author = body.author
    if (body.publish_date) insertData.publish_date = body.publish_date
    if (typeof body.featured === 'boolean') insertData.featured = body.featured
    if (typeof body.published === 'boolean') insertData.published = body.published

    console.log('Attempting to insert news article:', { ...insertData, content: '...' })

    const { data, error } = await supabase
      .from('news')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({
        error: 'Failed to create news article',
        details: error.message
      }, { status: 500 })
    }

    console.log('Successfully created news article:', data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    // Build update object with all supported fields
    const updateObject: any = {}

    // Add fields if provided
    if (updateData.title !== undefined) updateObject.title = updateData.title
    if (updateData.arabic_title !== undefined) updateObject.arabic_title = updateData.arabic_title
    if (updateData.slug !== undefined) updateObject.slug = updateData.slug
    if (updateData.excerpt !== undefined) updateObject.excerpt = updateData.excerpt
    if (updateData.content !== undefined) updateObject.content = updateData.content
    if (updateData.featured_image !== undefined) updateObject.featured_image = updateData.featured_image
    if (updateData.category !== undefined) updateObject.category = updateData.category
    if (updateData.tags !== undefined && Array.isArray(updateData.tags)) updateObject.tags = updateData.tags
    if (updateData.author !== undefined) updateObject.author = updateData.author
    if (updateData.publish_date !== undefined) updateObject.publish_date = updateData.publish_date
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