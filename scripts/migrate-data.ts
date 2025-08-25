import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateData() {
  console.log('🚀 Starting data migration from JSON files to Supabase...')

  try {
    // Read JSON data files
    const dataDir = path.join(__dirname, '../src/data')
    
    // Migrate school info
    console.log('📋 Migrating school information...')
    const schoolInfo = JSON.parse(fs.readFileSync(path.join(dataDir, 'school-info.json'), 'utf8'))
    
    const { error: schoolError } = await supabase
      .from('school_info')
      .insert({
        name: schoolInfo.school.name,
        tagline: schoolInfo.school.tagline,
        mission: schoolInfo.school.mission,
        arabic_text: schoolInfo.school.arabicText,
        contact_info: schoolInfo.contact,
        features: schoolInfo.features
      })
    
    if (schoolError) {
      console.error('❌ School info migration failed:', schoolError)
    } else {
      console.log('✅ School info migrated successfully')
    }

    // Migrate programs
    console.log('🎓 Migrating programs...')
    const programsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'programs.json'), 'utf8'))
    
    for (const program of programsData.programs) {
      const { error: programError } = await supabase
        .from('programs')
        .insert({
          title: program.title,
          age: program.age,
          description: program.description,
          features: program.features,
          color: program.color,
          icon: program.icon,
          tuition: program.tuition,
          curriculum: program.curriculum,
          published: true
        })
      
      if (programError) {
        console.error(`❌ Program ${program.title} migration failed:`, programError)
      } else {
        console.log(`✅ Program ${program.title} migrated successfully`)
      }
    }

    // Migrate additional programs
    for (const additionalProgram of programsData.additionalPrograms) {
      const { error: additionalError } = await supabase
        .from('additional_programs')
        .insert({
          title: additionalProgram.title,
          description: additionalProgram.description,
          icon: additionalProgram.icon,
          schedule: additionalProgram.schedule,
          tuition: additionalProgram.tuition,
          published: true
        })
      
      if (additionalError) {
        console.error(`❌ Additional program ${additionalProgram.title} migration failed:`, additionalError)
      } else {
        console.log(`✅ Additional program ${additionalProgram.title} migrated successfully`)
      }
    }

    // Migrate news
    console.log('📰 Migrating news articles...')
    const newsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'news.json'), 'utf8'))
    
    for (const article of newsData.news) {
      const { error: newsError } = await supabase
        .from('news')
        .insert({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          date: article.date,
          author: article.author,
          published: article.published,
          featured: article.featured,
          category: article.category,
          image_url: article.image
        })
      
      if (newsError) {
        console.error(`❌ News article ${article.title} migration failed:`, newsError)
      } else {
        console.log(`✅ News article ${article.title} migrated successfully`)
      }
    }

    // Migrate achievements
    console.log('🏆 Migrating achievements...')
    const achievementsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'achievements.json'), 'utf8'))
    
    for (const [index, achievement] of achievementsData.achievements.entries()) {
      const { error: achievementError } = await supabase
        .from('achievements')
        .insert({
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          type: achievement.type,
          icon: achievement.icon,
          featured: achievement.featured,
          display_order: achievement.order || index + 1,
          background_image: achievement.backgroundImage
        })
      
      if (achievementError) {
        console.error(`❌ Achievement ${achievement.title} migration failed:`, achievementError)
      } else {
        console.log(`✅ Achievement ${achievement.title} migrated successfully`)
      }
    }

    // Migrate events (if exists)
    const eventsPath = path.join(dataDir, 'events.json')
    if (fs.existsSync(eventsPath)) {
      console.log('📅 Migrating events...')
      const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'))
      
      for (const event of eventsData.events || []) {
        const { error: eventError } = await supabase
          .from('events')
          .insert({
            title: event.title,
            description: event.description,
            event_date: event.date,
            event_time: event.time,
            location: event.location,
            is_recurring: event.recurring || false,
            published: event.published !== false
          })
        
        if (eventError) {
          console.error(`❌ Event ${event.title} migration failed:`, eventError)
        } else {
          console.log(`✅ Event ${event.title} migrated successfully`)
        }
      }
    }

    // Migrate faculty/staff (if exists)
    const facultyPath = path.join(dataDir, 'faculty.json')
    if (fs.existsSync(facultyPath)) {
      console.log('👥 Migrating faculty/staff...')
      const facultyData = JSON.parse(fs.readFileSync(facultyPath, 'utf8'))
      
      // Map department names to enum values
      const departmentMap: { [key: string]: string } = {
        'Administration': 'administration',
        'Islamic Studies': 'islamic-studies',
        'Elementary Education': 'elementary',
        'Secondary Education': 'high-school',
        'Language Arts': 'arabic-language',
        'Student Services': 'administration'
      }
      
      for (const faculty of facultyData.faculty || []) {
        const mappedDepartment = departmentMap[faculty.department] || 'administration'
        
        const { error: facultyError } = await supabase
          .from('staff')
          .insert({
            name: faculty.name,
            position: faculty.position,
            department: mappedDepartment,
            bio: faculty.bio,
            photo_url: faculty.image,
            email: faculty.email,
            qualifications: faculty.qualifications || [],
            published: faculty.published !== false
          })
        
        if (facultyError) {
          console.error(`❌ Faculty ${faculty.name} migration failed:`, facultyError)
        } else {
          console.log(`✅ Faculty ${faculty.name} migrated successfully`)
        }
      }
    }

    console.log('🎉 Data migration completed successfully!')

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateData()