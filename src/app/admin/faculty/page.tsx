'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import Avatar from '@/components/admin/Avatar'
import ImageUpload from '@/components/admin/ImageUpload'

interface Faculty {
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

export default function FacultyManagementPage() {
  const [faculty, setFaculty] = useState<{faculty: Faculty[]} | null>(null)
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    try {
      const response = await fetch('/api/faculty?all=true')
      const data = await response.json()
      setFaculty(data)
    } catch (error) {
      setMessage('Error loading faculty data')
    }
  }

  const saveFaculty = async (facultyData: Faculty, action: 'create' | 'update' | 'delete') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...facultyData })
      })
      
      if (response.ok) {
        await loadFaculty()
        setMessage(`Faculty ${action}d successfully!`)
        setTimeout(() => setMessage(''), 3000)
        setShowForm(false)
        setEditingFaculty(null)
      } else {
        setMessage(`Failed to ${action} faculty`)
      }
    } catch (error) {
      setMessage(`Error ${action}ing faculty`)
    }
    setIsLoading(false)
  }

  const addNewFaculty = () => {
    const newFaculty: Faculty = {
      name: '',
      position: 'Teacher',
      department: 'Elementary Education',
      grade: 'Kindergarten',
      specialization: '',
      experience: '',
      bio: '',
      email: '',
      qualifications: [],
      languages: ['English'],
      subjects: [],
      achievements: [],
      featured: false,
      published: true
    }
    setEditingFaculty(newFaculty)
    setShowForm(true)
  }

  const editFaculty = (teacher: Faculty) => {
    setEditingFaculty(teacher)
    setShowForm(true)
  }

  const updateFaculty = (field: string, value: any) => {
    setEditingFaculty(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  const saveEditingFaculty = () => {
    if (!editingFaculty || !editingFaculty.name.trim()) {
      setMessage('Name is required')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    const action = editingFaculty.id ? 'update' : 'create'
    saveFaculty(editingFaculty, action)
  }

  const deleteFaculty = (teacher: Faculty) => {
    if (teacher.id && confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      saveFaculty(teacher, 'delete')
    }
  }

  const togglePublished = (teacher: Faculty) => {
    const updatedTeacher = { ...teacher, published: !teacher.published }
    saveFaculty(updatedTeacher, 'update')
  }

  const filteredFaculty = faculty?.faculty?.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = !filterGrade || teacher.grade === filterGrade
    return matchesSearch && matchesGrade
  }) || []

  const grades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9']

  return (
    <AdminLayout title="Faculty Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-deep-teal">Faculty Directory</h2>
            <p className="text-deep-teal/60">Manage teacher profiles and information</p>
          </div>
          <button
            onClick={addNewFaculty}
            className="flex items-center gap-2 bg-sage-green hover:bg-sage-green-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Faculty Member
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-sage-green-lighter border border-sage-green text-sage-green-darker p-4 rounded-lg">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8 text-sage-green" />
              <div>
                <p className="text-2xl font-bold text-deep-teal">{faculty?.faculty?.length || 0}</p>
                <p className="text-sm text-deep-teal/60">Total Faculty</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-terracotta-red rounded-full flex items-center justify-center text-white text-sm font-bold">👑</div>
              <div>
                <p className="text-2xl font-bold text-deep-teal">
                  {faculty?.faculty?.filter(f => f.position.toLowerCase().includes('principal') || f.position.toLowerCase().includes('director')).length || 0}
                </p>
                <p className="text-sm text-deep-teal/60">Leadership</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <EyeIcon className="w-8 h-8 text-deep-teal" />
              <div>
                <p className="text-2xl font-bold text-deep-teal">
                  {faculty?.faculty?.filter(f => f.published !== false).length || 0}
                </p>
                <p className="text-sm text-deep-teal/60">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-wood rounded-full flex items-center justify-center text-white text-sm font-bold">★</div>
              <div>
                <p className="text-2xl font-bold text-deep-teal">
                  {faculty?.faculty?.filter(f => f.featured).length || 0}
                </p>
                <p className="text-sm text-deep-teal/60">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 border border-soft-beige">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-deep-teal mb-2">Search Faculty</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-deep-teal/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, position, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-teal mb-2">Filter by Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
              >
                <option value="">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Faculty List */}
        <div className="bg-white rounded-lg border border-soft-beige overflow-hidden">
          <div className="p-6 border-b border-soft-beige">
            <h3 className="text-lg font-semibold text-deep-teal">
              Faculty Members ({filteredFaculty.length})
            </h3>
          </div>
          
          <div className="divide-y divide-soft-beige">
            {filteredFaculty.map((teacher) => (
              <div key={teacher.id} className="p-6 hover:bg-soft-beige-lightest transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Avatar 
                      src={teacher.image}
                      name={teacher.name}
                      alt={teacher.name}
                      size="md"
                    />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-semibold text-deep-teal">{teacher.name}</h4>
                          {teacher.arabic_name && (
                            <span className="text-sm text-deep-teal/60">({teacher.arabic_name})</span>
                          )}
                          <span className="bg-terracotta-red text-white px-2 py-1 rounded text-xs">
                            {teacher.grade}
                          </span>
                          <span className="bg-sage-green text-white px-2 py-1 rounded text-xs">
                            {teacher.position}
                          </span>
                          {(teacher.position.toLowerCase().includes('principal') || teacher.position.toLowerCase().includes('director')) && (
                            <span className="bg-terracotta-red text-white px-2 py-1 rounded text-xs">Leadership</span>
                          )}
                          {teacher.featured && (
                            <span className="bg-wood text-white px-2 py-1 rounded text-xs">Featured</span>
                          )}
                          {teacher.published === false && (
                            <span className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Draft</span>
                          )}
                        </div>
                        <p className="text-deep-teal/80 mb-1">{teacher.specialization}</p>
                        <p className="text-sm text-deep-teal/60">{teacher.experience}</p>
                        {teacher.email && (
                          <p className="text-sm text-deep-teal/60">{teacher.email}</p>
                        )}
                      </div>
                    </div>
                    
                    {teacher.languages && teacher.languages.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-deep-teal/60">Languages:</span>
                        <div className="flex gap-1">
                          {teacher.languages.map((lang, idx) => (
                            <span key={idx} className="bg-deep-teal-lighter text-deep-teal-dark px-2 py-1 rounded text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(teacher)}
                      className={`p-2 rounded-lg transition-colors ${
                        teacher.published !== false
                          ? 'bg-sage-green-lighter text-sage-green hover:bg-sage-green-light'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title={teacher.published !== false ? 'Published' : 'Draft'}
                    >
                      {teacher.published !== false ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => editFaculty(teacher)}
                      className="p-2 bg-deep-teal-lighter text-deep-teal hover:bg-deep-teal-light rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFaculty(teacher)}
                      className="p-2 bg-terracotta-red-lighter text-terracotta-red hover:bg-terracotta-red-light rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredFaculty.length === 0 && (
              <div className="p-8 text-center">
                <UserGroupIcon className="w-12 h-12 text-deep-teal/40 mx-auto mb-4" />
                <p className="text-deep-teal/60">No faculty members found</p>
                <button
                  onClick={addNewFaculty}
                  className="mt-4 text-sage-green hover:text-sage-green-dark transition-colors"
                >
                  Add your first faculty member
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Faculty Form Modal */}
        {showForm && editingFaculty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-soft-beige">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-deep-teal">
                    {editingFaculty.id ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingFaculty(null)
                    }}
                    className="text-deep-teal/60 hover:text-deep-teal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      value={editingFaculty.name}
                      onChange={(e) => updateFaculty('name', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="Enter teacher's name"
                    />
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Arabic Name</label>
                    <input
                      type="text"
                      value={editingFaculty.arabic_name || ''}
                      onChange={(e) => updateFaculty('arabic_name', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="Enter Arabic name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Position *</label>
                    <input
                      type="text"
                      value={editingFaculty.position}
                      onChange={(e) => updateFaculty('position', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="e.g. Teacher, Principal"
                    />
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Grade *</label>
                    <select
                      value={editingFaculty.grade || ''}
                      onChange={(e) => updateFaculty('grade', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                    >
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Department</label>
                    <input
                      type="text"
                      value={editingFaculty.department}
                      onChange={(e) => updateFaculty('department', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="e.g. Elementary Education"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={editingFaculty.email || ''}
                      onChange={(e) => updateFaculty('email', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="teacher@oiaaedmonton.ca"
                    />
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Specialization</label>
                    <input
                      type="text"
                      value={editingFaculty.specialization || ''}
                      onChange={(e) => updateFaculty('specialization', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="e.g. Mathematics, Islamic Studies"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-deep-teal font-semibold mb-2">Experience</label>
                  <input
                    type="text"
                    value={editingFaculty.experience || ''}
                    onChange={(e) => updateFaculty('experience', e.target.value)}
                    className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                    placeholder="e.g. 5 years teaching experience"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-deep-teal font-semibold mb-2">Biography</label>
                  <textarea
                    value={editingFaculty.bio || ''}
                    onChange={(e) => updateFaculty('bio', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                    placeholder="Brief biography and background..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Qualifications (comma-separated)</label>
                    <input
                      type="text"
                      value={editingFaculty.qualifications?.join(', ') || ''}
                      onChange={(e) => updateFaculty('qualifications', e.target.value.split(', ').filter(q => q.trim()))}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="B.Ed, M.A. Islamic Studies"
                    />
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Languages (comma-separated)</label>
                    <input
                      type="text"
                      value={editingFaculty.languages?.join(', ') || ''}
                      onChange={(e) => updateFaculty('languages', e.target.value.split(', ').filter(l => l.trim()))}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="English, Arabic, French"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Subjects (comma-separated)</label>
                    <input
                      type="text"
                      value={editingFaculty.subjects?.join(', ') || ''}
                      onChange={(e) => updateFaculty('subjects', e.target.value.split(', ').filter(s => s.trim()))}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                      placeholder="Mathematics, Islamic Studies, Science"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-deep-teal font-semibold mb-2">Achievements (comma-separated)</label>
                  <textarea
                    value={editingFaculty.achievements?.join(', ') || ''}
                    onChange={(e) => updateFaculty('achievements', e.target.value.split(', ').filter(a => a.trim()))}
                    rows={3}
                    className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-sage-green"
                    placeholder="Notable accomplishments, awards, recognitions..."
                  />
                </div>

                <div className="mb-4">
                  <ImageUpload
                    currentImage={editingFaculty.image}
                    onImageChange={(imageUrl) => updateFaculty('image', imageUrl)}
                    name={editingFaculty.name || 'New Teacher'}
                    disabled={isLoading}
                    folder="faculty"
                  />
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingFaculty.featured || false}
                      onChange={(e) => updateFaculty('featured', e.target.checked)}
                      className="w-4 h-4 text-sage-green"
                    />
                    <span className="text-deep-teal font-semibold">Featured Teacher</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingFaculty.published !== false}
                      onChange={(e) => updateFaculty('published', e.target.checked)}
                      className="w-4 h-4 text-sage-green"
                    />
                    <span className="text-deep-teal font-semibold">Published</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveEditingFaculty}
                    disabled={isLoading}
                    className="bg-sage-green hover:bg-sage-green-dark text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Faculty Member'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingFaculty(null)
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}