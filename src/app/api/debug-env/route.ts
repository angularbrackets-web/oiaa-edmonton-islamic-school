import { NextResponse } from 'next/server'

// Temporary debug endpoint - REMOVE AFTER TESTING
export async function GET() {
  return NextResponse.json({
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    cloudNameLength: process.env.CLOUDINARY_CLOUD_NAME?.length,
    apiKeyLength: process.env.CLOUDINARY_API_KEY?.length,
    apiSecretLength: process.env.CLOUDINARY_API_SECRET?.length,
    // Show first/last 3 chars for verification (not the full key)
    cloudNamePreview: process.env.CLOUDINARY_CLOUD_NAME?.slice(0, 3) + '...' + process.env.CLOUDINARY_CLOUD_NAME?.slice(-3),
    apiKeyPreview: process.env.CLOUDINARY_API_KEY?.slice(0, 3) + '...' + process.env.CLOUDINARY_API_KEY?.slice(-3),
  })
}
