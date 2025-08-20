import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg',
      'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Determine upload directory based on file type
    let uploadDir = 'images'
    if (file.type.startsWith('video/')) uploadDir = 'videos'
    if (file.type === 'application/pdf') uploadDir = 'documents'

    // Create safe filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${originalName}`
    
    // Ensure upload directory exists
    const fullUploadDir = path.join(process.cwd(), 'public/uploads', uploadDir)
    await mkdir(fullUploadDir, { recursive: true })
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(fullUploadDir, filename)
    
    await writeFile(filePath, buffer)
    
    // Return public URL
    const publicUrl = `/uploads/${uploadDir}/${filename}`
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      type: uploadDir,
      size: file.size,
      originalName: file.name
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}