import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables')
      return NextResponse.json({
        error: 'Server configuration error: Missing Cloudinary credentials'
      }, { status: 500 })
    }

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
      console.error('Cloudinary upload returned null/undefined result')
      return NextResponse.json({ error: 'Failed to upload image to Cloudinary' }, { status: 500 })
    }

    // Save reference in Supabase with enhanced metadata
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .insert({
        url: result.secure_url,
        alt: alt,
        public_id: result.public_id,
        folder: folder,
        file_type: result.resource_type,
        width: result.width,
        height: result.height,
        file_size: result.bytes,
        original_filename: file.name
      })
      .select()
      .single()

    if (mediaError) {
      console.error('Supabase error (non-critical):', mediaError)
      // Still return the Cloudinary URL even if database save fails
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      mediaId: mediaData?.id
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upload image'
    }, { status: 500 })
  }
}