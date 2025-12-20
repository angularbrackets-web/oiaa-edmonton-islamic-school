import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// Dynamically import Resend to avoid build errors if not installed
let resend: any = null

async function initResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    try {
      // @ts-ignore - Dynamic import for optional dependency
      const { Resend } = await import('resend')
      resend = new Resend(process.env.RESEND_API_KEY)
    } catch (e) {
      console.log('Resend not installed. Email notifications disabled.')
    }
  }
  return resend
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { form_name, form_data, notify_email, email_subject } = body

    // Basic validation
    if (!form_name || !form_data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract common fields from form_data for easy querying
    const email = form_data.email || form_data.Email || form_data.EMAIL
    const name = form_data.name || form_data.Name || form_data.NAME || form_data['Full Name'] || form_data['full_name']
    const phone = form_data.phone || form_data.Phone || form_data.PHONE || form_data['Phone Number'] || form_data['phone_number']

    // Insert submission into database using service role to bypass RLS
    const { data: submission, error: insertError } = await supabaseAdmin
      .from('form_submissions')
      .insert({
        form_name,
        data: form_data,
        email,
        name,
        phone,
        status: 'new',
        email_sent: false
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to save submission. Please try again.' },
        { status: 500 }
      )
    }

    // Send email notification if configured
    let emailSent = false
    const resendClient = await initResend()

    // Get notification email from settings if not provided
    let finalNotifyEmail = notify_email
    if (!finalNotifyEmail && process.env.ADMIN_EMAIL) {
      finalNotifyEmail = process.env.ADMIN_EMAIL
    }

    if (finalNotifyEmail && resendClient) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'

        const { data: emailData, error: emailError } = await resendClient.emails.send({
          from: fromEmail,
          to: finalNotifyEmail,
          subject: email_subject || `New ${form_name} submission`,
          html: formatEmailContent(form_name, form_data, submission.id)
        })

        if (!emailError) {
          emailSent = true
          // Update submission to mark email as sent
          await supabaseAdmin
            .from('form_submissions')
            .update({ email_sent: true })
            .eq('id', submission.id)
        } else {
          console.error('Resend error:', emailError)
        }
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the submission if email fails
      }
    }

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
      email_sent: emailSent,
      message: 'Form submitted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to format email content
function formatEmailContent(formName: string, formData: Record<string, any>, submissionId: string): string {
  const fields = Object.entries(formData)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : value
      return `<tr>
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb; width: 35%;">${key}</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">${formattedValue}</td>
      </tr>`
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #145B55 0%, #0d3d39 100%); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">New Form Submission</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 16px;">${formName}</p>
        </div>

        <!-- Content -->
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <p style="margin: 0 0 20px 0; color: #4b5563;">You have received a new form submission. Details below:</p>

          <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
            <tbody>
              ${fields}
            </tbody>
          </table>

          <!-- Action Button -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/form-submissions"
               style="display: inline-block; background: #D04845; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
              View All Submissions
            </a>
          </div>

          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Submission ID: ${submissionId}</p>
            <p style="margin: 4px 0 0 0;">Submitted: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
        </div>

        <!-- Logo/Branding -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This email was sent from your website contact form.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// GET endpoint to retrieve submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formName = searchParams.get('form_name')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (formName) {
      query = query.eq('form_name', formName)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [], // Return as 'data' for consistency with other APIs
      count: data?.length || 0
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
