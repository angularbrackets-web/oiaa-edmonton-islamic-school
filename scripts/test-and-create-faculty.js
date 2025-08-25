#!/usr/bin/env node

// Script to test faculty table and create if needed
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqifzqosnyhgglrkzkur.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWZ6cW9zbnloZ2dscmt6a3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc0MTAwMiwiZXhwIjoyMDcxMzE3MDAyfQ.V6TKIBcyIfJWdK6nJ2wnKGW-X6Dr1zUDaoH4OaRIBHU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testFacultyTable() {
  try {
    console.log('🔍 Testing faculty table...')
    
    // Try to read from faculty table
    const { data, error } = await supabase
      .from('faculty')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('❌ Faculty table does not exist or error:', error.message)
      console.log('🔧 You need to create the faculty table manually in Supabase SQL Editor')
      console.log('\n📝 SQL to create the table:')
      console.log(`
CREATE TABLE faculty (
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

-- Enable RLS
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published faculty
CREATE POLICY "Public can read published faculty" ON faculty
  FOR SELECT USING (published = true);

-- Allow service role full access
CREATE POLICY "Service role can manage faculty" ON faculty
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
      `)
      return false
    } else {
      console.log('✅ Faculty table exists and accessible!')
      console.log(`📊 Current faculty count: ${data.length}`)
      return true
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
    return false
  }
}

// Run the test
testFacultyTable()