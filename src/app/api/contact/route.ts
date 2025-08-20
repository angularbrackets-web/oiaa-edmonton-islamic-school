import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, inquiryType, message } = body

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    
    // For now, we'll log the submission and return success
    console.log('Contact form submission:', {
      firstName,
      lastName,
      email,
      phone,
      inquiryType,
      message,
      timestamp: new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}