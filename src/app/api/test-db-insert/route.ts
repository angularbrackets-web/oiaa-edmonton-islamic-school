import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Test if we can insert into media table with new columns
export async function GET() {
  try {
    // Try to insert a test record (using admin client to bypass RLS)
    const testData = {
      url: 'https://test.example.com/test.jpg',
      alt: 'Test insert',
      public_id: 'test/test-' + Date.now(),
      folder: 'test',
      file_type: 'image',
      width: 800,
      height: 600,
      file_size: 12345,
      original_filename: 'test.jpg'
    }

    const { data, error } = await supabaseAdmin
      .from('media')
      .insert(testData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: 'Failed to insert test record - this is why uploads are not being saved!'
      }, { status: 500 })
    }

    // Clean up test record
    if (data) {
      await supabaseAdmin.from('media').delete().eq('id', data.id)
    }

    return NextResponse.json({
      success: true,
      message: 'Database insert works! Media table has all required columns.',
      insertedData: data
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Exception during test insert'
    }, { status: 500 })
  }
}
