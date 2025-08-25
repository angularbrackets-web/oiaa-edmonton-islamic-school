import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') })

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ImageMapping {
  localPath: string
  cloudinaryUrl: string
  publicId: string
  folder: string
}

async function uploadImageToCloudinary(localPath: string, folder: string): Promise<any> {
  const fullPath = path.join(__dirname, '../public', localPath)
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${fullPath}`)
    return null
  }

  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: `islamic-school/${folder}`,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log(`✅ Uploaded: ${localPath} -> ${result.secure_url}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error)
    return null
  }
}

async function migrateImagesToCloudinary() {
  console.log('🚀 Starting image migration to Cloudinary...')
  
  const imageMappings: ImageMapping[] = []

  try {
    // Get all achievements with background images
    console.log('📋 Migrating achievement background images...')
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')

    if (achievementsError) {
      console.error('❌ Failed to fetch achievements:', achievementsError)
      return
    }

    for (const achievement of achievements || []) {
      if (achievement.background_image && achievement.background_image.startsWith('/uploads/')) {
        const result = await uploadImageToCloudinary(achievement.background_image, 'achievements')
        
        if (result) {
          // Update database with Cloudinary URL
          const { error: updateError } = await supabase
            .from('achievements')
            .update({ background_image: result.secure_url })
            .eq('id', achievement.id)

          if (updateError) {
            console.error(`❌ Failed to update achievement ${achievement.id}:`, updateError)
          } else {
            console.log(`✅ Updated achievement: ${achievement.title}`)
          }

          // Save to media table
          await supabase.from('media').insert({
            url: result.secure_url,
            alt: `Achievement: ${achievement.title}`,
            public_id: result.public_id,
            folder: 'islamic-school/achievements',
            file_type: result.resource_type
          })

          imageMappings.push({
            localPath: achievement.background_image,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
            folder: 'achievements'
          })
        }
      }
    }

    // Get all news with images
    console.log('📰 Migrating news images...')
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')

    if (newsError) {
      console.error('❌ Failed to fetch news:', newsError)
    } else {
      for (const article of news || []) {
        if (article.image_url && article.image_url.startsWith('/uploads/')) {
          const result = await uploadImageToCloudinary(article.image_url, 'news')
          
          if (result) {
            // Update database with Cloudinary URL
            const { error: updateError } = await supabase
              .from('news')
              .update({ image_url: result.secure_url })
              .eq('id', article.id)

            if (updateError) {
              console.error(`❌ Failed to update news ${article.id}:`, updateError)
            } else {
              console.log(`✅ Updated news: ${article.title}`)
            }

            // Save to media table
            await supabase.from('media').insert({
              url: result.secure_url,
              alt: `News: ${article.title}`,
              public_id: result.public_id,
              folder: 'islamic-school/news',
              file_type: result.resource_type
            })

            imageMappings.push({
              localPath: article.image_url,
              cloudinaryUrl: result.secure_url,
              publicId: result.public_id,
              folder: 'news'
            })
          }
        }
      }
    }

    // Get all staff with photos
    console.log('👥 Migrating staff photos...')
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')

    if (staffError) {
      console.error('❌ Failed to fetch staff:', staffError)
    } else {
      for (const person of staff || []) {
        if (person.photo_url && person.photo_url.startsWith('/uploads/')) {
          const result = await uploadImageToCloudinary(person.photo_url, 'faculty')
          
          if (result) {
            // Update database with Cloudinary URL
            const { error: updateError } = await supabase
              .from('staff')
              .update({ photo_url: result.secure_url })
              .eq('id', person.id)

            if (updateError) {
              console.error(`❌ Failed to update staff ${person.id}:`, updateError)
            } else {
              console.log(`✅ Updated staff: ${person.name}`)
            }

            // Save to media table
            await supabase.from('media').insert({
              url: result.secure_url,
              alt: `Staff: ${person.name}`,
              public_id: result.public_id,
              folder: 'islamic-school/faculty',
              file_type: result.resource_type
            })

            imageMappings.push({
              localPath: person.photo_url,
              cloudinaryUrl: result.secure_url,
              publicId: result.public_id,
              folder: 'faculty'
            })
          }
        }
      }
    }

    // Upload additional key images for the website
    console.log('🌟 Uploading additional website images...')
    const additionalImages = [
      { path: '/images/hero-1.jpg', folder: 'hero' },
      { path: '/images/hero-2.jpg', folder: 'hero' },
      { path: '/images/hero-3.jpg', folder: 'hero' }
    ]

    for (const img of additionalImages) {
      const result = await uploadImageToCloudinary(img.path, img.folder)
      if (result) {
        await supabase.from('media').insert({
          url: result.secure_url,
          alt: `Website ${img.folder} image`,
          public_id: result.public_id,
          folder: `islamic-school/${img.folder}`,
          file_type: result.resource_type
        })

        imageMappings.push({
          localPath: img.path,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          folder: img.folder
        })
      }
    }

    // Save image mappings to a file for reference
    const mappingPath = path.join(__dirname, '../image-mappings.json')
    fs.writeFileSync(mappingPath, JSON.stringify(imageMappings, null, 2))
    console.log(`📄 Image mappings saved to: ${mappingPath}`)

    console.log('🎉 Image migration completed successfully!')
    console.log(`📊 Total images migrated: ${imageMappings.length}`)
    
    // Print summary
    const folders = [...new Set(imageMappings.map(m => m.folder))]
    folders.forEach(folder => {
      const count = imageMappings.filter(m => m.folder === folder).length
      console.log(`   ${folder}: ${count} images`)
    })

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateImagesToCloudinary()