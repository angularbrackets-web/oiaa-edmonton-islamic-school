import { NextResponse } from 'next/server'
import { facultyService, Faculty } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('all') === 'true'
    
    const faculty = includeAll 
      ? await facultyService.getAll()
      : await facultyService.getPublished()
    
    return NextResponse.json({ faculty })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json(
      { error: 'Failed to load faculty data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (body.action === 'create') {
      const facultyData: Omit<Faculty, 'id' | 'created_at' | 'updated_at'> = {
        name: body.name,
        arabic_name: body.arabic_name,
        position: body.position,
        department: body.department,
        email: body.email,
        qualifications: body.qualifications || [],
        experience: body.experience,
        specialization: body.specialization,
        bio: body.bio,
        image: body.image,
        languages: body.languages || [],
        subjects: body.subjects || [],
        grade: body.grade,
        achievements: body.achievements || [],
        featured: body.featured || false,
        published: body.published !== undefined ? body.published : true
      }
      
      const newFaculty = await facultyService.create(facultyData)
      return NextResponse.json(newFaculty)
    }
    
    if (body.action === 'update' && body.id) {
      const updates: Partial<Faculty> = {}
      
      // Only include fields that are provided
      if (body.name !== undefined) updates.name = body.name
      if (body.arabic_name !== undefined) updates.arabic_name = body.arabic_name
      if (body.position !== undefined) updates.position = body.position
      if (body.department !== undefined) updates.department = body.department
      if (body.email !== undefined) updates.email = body.email
      if (body.qualifications !== undefined) updates.qualifications = body.qualifications
      if (body.experience !== undefined) updates.experience = body.experience
      if (body.specialization !== undefined) updates.specialization = body.specialization
      if (body.bio !== undefined) updates.bio = body.bio
      if (body.image !== undefined) updates.image = body.image
      if (body.languages !== undefined) updates.languages = body.languages
      if (body.subjects !== undefined) updates.subjects = body.subjects
      if (body.grade !== undefined) updates.grade = body.grade
      if (body.achievements !== undefined) updates.achievements = body.achievements
      if (body.featured !== undefined) updates.featured = body.featured
      if (body.published !== undefined) updates.published = body.published
      
      const updatedFaculty = await facultyService.update(body.id, updates)
      return NextResponse.json(updatedFaculty)
    }
    
    if (body.action === 'delete' && body.id) {
      await facultyService.delete(body.id)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: 'Invalid action or missing required fields' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error in faculty API:', error)
    return NextResponse.json(
      { error: 'Failed to process faculty request' },
      { status: 500 }
    )
  }
}