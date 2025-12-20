import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - Fetch all site settings (optionally filtered by category)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('site_settings')
      .select('*')
      .order('category')
      .order('setting_key')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Also return settings as a key-value object for easy access
    const settingsMap: Record<string, string> = {}
    data?.forEach((setting: { setting_key: string; setting_value: string | null }) => {
      settingsMap[setting.setting_key] = setting.setting_value || ''
    })

    return NextResponse.json({
      success: true,
      data,
      settings: settingsMap
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update multiple settings at once
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body // Object of { setting_key: value }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Update each setting
    const errors: string[] = []
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabaseAdmin
        .from('site_settings')
        .update({ setting_value: value as string })
        .eq('setting_key', key)

      if (error) {
        errors.push(`${key}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Some settings failed to update',
        details: errors
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update single setting by key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { setting_key, setting_value } = body

    if (!setting_key) {
      return NextResponse.json(
        { success: false, error: 'Setting key is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({ setting_value })
      .eq('setting_key', setting_key)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
