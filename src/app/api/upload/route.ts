import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables:', {
        CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET
      })
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

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      folder
    })

    // Upload to Cloudinary
    const result = await uploadImage(file, folder) as any

    if (!result) {
      console.error('Cloudinary upload returned null/undefined result')
      return NextResponse.json({ error: 'Failed to upload image to Cloudinary' }, { status: 500 })
    }

    console.log('Cloudinary upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url
    })

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
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })

    // Serialize error properly
    let errorDetails
    try {
      errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error))
    } catch {
      errorDetails = String(error)
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error',
      details: errorDetails,
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
      env: process.env.NODE_ENV
    }, { status: 500 })
  }
}