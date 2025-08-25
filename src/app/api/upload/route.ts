import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'islamic-school'
    const alt = formData.get('alt') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, folder) as any

    if (!result) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    // Save reference in Supabase
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .insert({
        url: result.secure_url,
        alt: alt,
        public_id: result.public_id,
        folder: folder,
        file_type: result.resource_type
      })
      .select()
      .single()

    if (mediaError) {
      console.error('Supabase error:', mediaError)
      // Still return the Cloudinary URL even if database save fails
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      mediaId: mediaData?.id
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}