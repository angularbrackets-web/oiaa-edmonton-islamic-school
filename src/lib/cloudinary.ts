import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
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
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return result
}