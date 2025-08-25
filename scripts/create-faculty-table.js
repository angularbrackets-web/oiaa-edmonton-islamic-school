#!/usr/bin/env node

// Script to create faculty table in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqifzqosnyhgglrkzkur.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWZ6cW9zbnloZ2dscmt6a3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc0MTAwMiwiZXhwIjoyMDcxMzE3MDAyfQ.V6TKIBcyIfJWdK6nJ2wnKGW-X6Dr1zUDaoH4OaRIBHU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createFacultyTable() {
  try {
    console.log('🚀 Creating faculty table...')
    
    // First check if table exists
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'faculty')
    
    if (checkError) {
      console.log('ℹ️  Cannot check table existence via information_schema, proceeding with creation...')
    } else if (tables && tables.length > 0) {
      console.log('✅ Faculty table already exists!')
      return
    }
    
    // Create the table using raw SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS faculty (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        arabic_name TEXT,
        position TEXT NOT NULL,
        department TEXT NOT NULL,
        email TEXT,
        qualifications TEXT[],
        experience TEXT,
        specialization TEXT,
        bio TEXT,
        image TEXT,
        languages TEXT[],
        subjects TEXT[],
        grade TEXT,
        achievements TEXT[],
        featured BOOLEAN DEFAULT false,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Add RLS policy
      ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
      
      -- Allow public read access
      CREATE POLICY "Public can read published faculty" ON faculty
        FOR SELECT USING (published = true);
      
      -- Allow authenticated users to manage faculty
      CREATE POLICY "Authenticated users can manage faculty" ON faculty
        FOR ALL USING (auth.role() = 'authenticated');
    `
    
    const { data, error } = await supabase.rpc('exec', { sql: createTableSQL })
    
    if (error) {
      console.error('❌ Error creating table:', error.message)
      process.exit(1)
    }
    
    console.log('✅ Faculty table created successfully!')
    
    // Test the table by inserting a simple record
    const testRecord = {
      name: 'Test Faculty',
      position: 'Teacher',
      department: 'Test',
      published: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('faculty')
      .insert(testRecord)
      .select()
    
    if (insertError) {
      console.log('⚠️  Note: Table created but test insert failed:', insertError.message)
    } else {
      console.log('✅ Table test successful!')
      
      // Clean up test record
      await supabase
        .from('faculty')
        .delete()
        .eq('name', 'Test Faculty')
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error.message)
    process.exit(1)
  }
}

// Run the script
createFacultyTable()