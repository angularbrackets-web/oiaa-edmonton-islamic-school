import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
// Trim environment variables to remove any trailing whitespace/newlines
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
})

export { cloudinary }

// Helper function to get optimized image URL
export function getOptimizedImageUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: string
  format?: string
}) {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto'
  } = options || {}

  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    format,
    secure: true,
  })
}

// Helper function to upload image
export async function uploadImage(file: File, folder: string = 'islamic-school') {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error.message)
          reject(error)
        } else {
          resolve(result)
        }
      }
    ).end(buffer)
  })

  return result
}