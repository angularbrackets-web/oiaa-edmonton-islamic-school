import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('school_info')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch school info' }, { status: 500 })
    }

    // Transform data to match the expected format
    const transformedData = {
      school: {
        name: data.name,
        tagline: data.tagline,
        mission: data.mission,
        arabicText: data.arabic_text
      },
      contact: data.contact_info,
      features: data.features
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
    
    const { data, error } = await supabase
      .from('school_info')
      .upsert({
        name: body.school.name,
        tagline: body.school.tagline,
        mission: body.school.mission,
        arabic_text: body.school.arabicText,
        contact_info: body.contact,
        features: body.features
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update school info' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}