import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // First, get the media record to obtain the public_id
    const { data: mediaRecord, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !mediaRecord) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(mediaRecord.public_id, {
        resource_type: mediaRecord.file_type === 'video' ? 'video' : 'image'
      })
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete media from database' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
