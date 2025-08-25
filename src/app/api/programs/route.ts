import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const [programsResult, additionalProgramsResult] = await Promise.all([
      supabase
        .from('programs')
        .select('*')
        .eq('published', true)
        .order('created_at'),
      supabase
        .from('additional_programs')
        .select('*')
        .eq('published', true)
        .order('created_at')
    ])

    if (programsResult.error) {
      console.error('Supabase error (programs):', programsResult.error)
      return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
    }

    if (additionalProgramsResult.error) {
      console.error('Supabase error (additional programs):', additionalProgramsResult.error)
      return NextResponse.json({ error: 'Failed to fetch additional programs' }, { status: 500 })
    }

    // Transform data to match the expected format
    const transformedData = {
      programs: programsResult.data.map(program => ({
        id: program.id,
        title: program.title,
        age: program.age,
        description: program.description,
        features: program.features,
        color: program.color,
        icon: program.icon,
        tuition: program.tuition,
        curriculum: program.curriculum
      })),
      additionalPrograms: additionalProgramsResult.data.map(program => ({
        title: program.title,
        description: program.description,
        icon: program.icon,
        schedule: program.schedule,
        tuition: program.tuition
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
    
    // Handle both main programs and additional programs
    if (body.programs) {
      for (const program of body.programs) {
        const { error } = await supabase
          .from('programs')
          .upsert({
            id: program.id,
            title: program.title,
            age: program.age,
            description: program.description,
            features: program.features,
            color: program.color,
            icon: program.icon,
            tuition: program.tuition,
            curriculum: program.curriculum,
            published: true
          })

        if (error) {
          console.error('Supabase error:', error)
          return NextResponse.json({ error: 'Failed to update programs' }, { status: 500 })
        }
      }
    }

    if (body.additionalPrograms) {
      for (const program of body.additionalPrograms) {
        const { error } = await supabase
          .from('additional_programs')
          .upsert({
            title: program.title,
            description: program.description,
            icon: program.icon,
            schedule: program.schedule,
            tuition: program.tuition,
            published: true
          })

        if (error) {
          console.error('Supabase error:', error)
          return NextResponse.json({ error: 'Failed to update additional programs' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}