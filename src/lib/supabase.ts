import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for our database tables
export interface SchoolInfo {
  id: string
  name: string
  tagline: string
  mission: string
  arabic_text: string
  contact_info: any
  features: any[]
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  title: string
  age: string
  description: string
  features: string[]
  color: string
  icon: string
  tuition: number
  curriculum: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  published: boolean
  featured: boolean
  category?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time?: string
  location?: string
  is_recurring: boolean
  published: boolean
  created_at: string
  updated_at: string
}

export interface Faculty {
  id?: string
  name: string
  arabic_name?: string
  position: string
  department: string
  email?: string
  qualifications?: string[]
  experience?: string
  specialization?: string
  bio?: string
  image?: string
  languages?: string[]
  subjects?: string[]
  grade?: string
  achievements?: string[]
  featured?: boolean
  published?: boolean
  created_at?: string
  updated_at?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: string
  icon: string
  featured: boolean
  order: number
  background_image: string
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  url: string
  alt: string
  public_id: string
  folder: string
  file_type: string
  created_at: string
  updated_at: string
}

// Faculty service functions
export const facultyService = {
  // Get all faculty members (for admin)
  async getAll(): Promise<Faculty[]> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('grade', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get published faculty members (for public site)
  async getPublished(): Promise<Faculty[]> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('published', true)
      .order('grade', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get faculty member by ID
  async getById(id: string): Promise<Faculty | null> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new faculty member
  async create(faculty: Omit<Faculty, 'id' | 'created_at' | 'updated_at'>): Promise<Faculty> {
    const { data, error } = await supabaseAdmin
      .from('faculty')
      .insert(faculty)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update faculty member
  async update(id: string, faculty: Partial<Faculty>): Promise<Faculty> {
    const { data, error } = await supabaseAdmin
      .from('faculty')
      .update(faculty)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete faculty member
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('faculty')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get faculty by department
  async getByDepartment(department: string): Promise<Faculty[]> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('department', department)
      .eq('published', true)
      .order('grade', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get featured faculty
  async getFeatured(): Promise<Faculty[]> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('grade', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}