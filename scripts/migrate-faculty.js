#!/usr/bin/env node

// Migration script to transfer faculty data from JSON to Supabase
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqifzqosnyhgglrkzkur.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWZ6cW9zbnloZ2dscmt6a3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc0MTAwMiwiZXhwIjoyMDcxMzE3MDAyfQ.V6TKIBcyIfJWdK6nJ2wnKGW-X6Dr1zUDaoH4OaRIBHU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateFaculty() {
  try {
    console.log('🚀 Starting faculty migration...')
    
    // Read the faculty JSON file
    const facultyPath = path.join(__dirname, '../src/data/faculty.json')
    const facultyData = JSON.parse(fs.readFileSync(facultyPath, 'utf8'))
    
    console.log(`📚 Found ${facultyData.faculty.length} faculty members to migrate`)
    
    // Clear existing faculty data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing faculty data...')
    const { error: deleteError } = await supabase
      .from('faculty')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // This will delete all rows
    
    if (deleteError) {
      console.warn('⚠️  Warning clearing existing data:', deleteError.message)
    }
    
    // Migrate each faculty member
    for (const member of facultyData.faculty) {
      console.log(`📝 Migrating: ${member.name}`)
      
      const facultyRecord = {
        name: member.name,
        arabic_name: member.arabicName || null,
        position: member.position,
        department: member.department,
        email: member.email || null,
        qualifications: member.qualifications || [],
        experience: member.experience || null,
        specialization: member.specialization || null,
        bio: member.bio || null,
        image: member.image || null,
        languages: member.languages || [],
        subjects: member.subjects || [],
        grade: member.grade || null,
        achievements: member.achievements || [],
        featured: member.featured || false,
        published: true
      }
      
      const { data, error } = await supabase
        .from('faculty')
        .insert(facultyRecord)
        .select()
      
      if (error) {
        console.error(`❌ Error migrating ${member.name}:`, error.message)
      } else {
        console.log(`✅ Successfully migrated: ${member.name}`)
      }
    }
    
    // Verify the migration
    const { data: migratedFaculty, error: fetchError } = await supabase
      .from('faculty')
      .select('count(*)')
    
    if (fetchError) {
      console.error('❌ Error verifying migration:', fetchError.message)
    } else {
      console.log(`🎉 Migration complete! ${migratedFaculty[0].count} faculty members in database`)
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  }
}

// Run the migration
migrateFaculty()