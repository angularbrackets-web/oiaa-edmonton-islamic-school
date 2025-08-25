import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('publish_date', { ascending: false })

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
      console.log('Falling back to JSON data...')
      
      // Fallback to JSON file data if database is not available
      try {
        const filePath = path.join(process.cwd(), 'src/data/news.json')
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        let filteredNews = jsonData.news.filter((article: any) => article.published)
        
        // Apply category filter
        if (category && category !== 'all') {
          filteredNews = filteredNews.filter((article: any) => article.category === category)
        }
        
        // Apply featured filter
        if (featured === 'true') {
          filteredNews = filteredNews.filter((article: any) => article.featured)
        }
        
        // Sort by publish_date (most recent first)
        filteredNews.sort((a: any, b: any) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
        
        // Apply limit
        if (limit) {
          filteredNews = filteredNews.slice(0, limit)
        }
        
        return NextResponse.json({ news: filteredNews })
      } catch (fileError) {
        console.error('Failed to load fallback JSON data:', fileError)
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
      }
    }

    // Transform data to match the expected format
    const transformedData = {
      news: data.map(article => ({
        id: article.id,
        title: article.title,
        arabic_title: article.arabic_title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featured_image: article.featured_image,
        category: article.category,
        tags: article.tags || [],
        author: article.author,
        featured: article.featured,
        published: article.published,
        publish_date: article.publish_date,
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

    // Create new article
    const { error } = await supabase
      .from('news')
      .insert({
        title: body.title,
        arabic_title: body.arabic_title,
        slug: body.slug || generateSlug(body.title),
        excerpt: body.excerpt,
        content: body.content,
        featured_image: body.featured_image,
        category: body.category || 'general',
        tags: body.tags || [],
        author: body.author || 'Admin',
        featured: body.featured || false,
        published: body.published || true,
        publish_date: body.publish_date || new Date().toISOString()
      })

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

    const { error } = await supabase
      .from('news')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
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