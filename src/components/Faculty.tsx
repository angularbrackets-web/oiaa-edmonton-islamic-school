'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface FacultyMember {
  id: string
  name: string
  arabicName: string
  position: string
  department: string
  email: string
  qualifications: string[]
  experience: string
  specialization: string
  bio: string
  image: string
  languages: string[]
  subjects: string[]
  achievements: string[]
  featured: boolean
}

interface Department {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface FacultyData {
  faculty: FacultyMember[]
  departments: Department[]
  stats: {
    totalFaculty: number
    averageExperience: number
    languages: string[]
    certifications: number
  }
}

export default function Faculty() {
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => {
        setFacultyData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading faculty data:', err)
        setLoading(false)
      })
  }, [])

  const filteredFaculty = facultyData?.faculty.filter(member => 
    selectedDepartment === 'all' || member.department.toLowerCase().replace(/\s+/g, '-') === selectedDepartment
  ) || []

  const featuredFaculty = facultyData?.faculty.filter(member => member.featured) || []

  if (loading) {
    return (
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-soft-beige rounded max-w-md mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-soft-beige rounded"></div>
                  <div className="h-6 bg-soft-beige rounded"></div>
                  <div className="h-4 bg-soft-beige rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!facultyData) {
    return (
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-terracotta-red mb-4">
            Unable to load faculty information
          </h2>
          <p className="text-deep-teal">Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-terracotta-red mb-6">
            Our Dedicated Faculty
          </h2>
          <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
          <p className="text-xl text-deep-teal max-w-3xl mx-auto">
            Meet our passionate educators who combine academic excellence with Islamic values 
            to guide and inspire our students.
          </p>
        </div>

        {/* Faculty Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-soft-beige-lightest rounded-lg p-6 text-center border border-soft-beige">
            <div className="text-3xl text-terracotta-red font-bold mb-2">
              {facultyData.stats.totalFaculty}
            </div>
            <p className="text-deep-teal font-medium">Faculty Members</p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 text-center border border-soft-beige">
            <div className="text-3xl text-sage-green font-bold mb-2">
              {facultyData.stats.averageExperience}
            </div>
            <p className="text-deep-teal font-medium">Years Average Experience</p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 text-center border border-soft-beige">
            <div className="text-3xl text-wood font-bold mb-2">
              {facultyData.stats.languages.length}
            </div>
            <p className="text-deep-teal font-medium">Languages Spoken</p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 text-center border border-soft-beige">
            <div className="text-3xl text-deep-teal font-bold mb-2">
              {facultyData.stats.certifications}
            </div>
            <p className="text-deep-teal font-medium">Certifications</p>
          </div>
        </div>

        {/* Featured Faculty */}
        {featuredFaculty.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-terracotta-red mb-8 text-center">
              Leadership Team
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              {featuredFaculty.map((member) => (
                <div key={member.id} className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-lg border border-soft-beige">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative h-64 md:h-auto">
                      <div className="w-full h-full bg-soft-beige flex items-center justify-center">
                        <div className="text-6xl text-terracotta-red">👤</div>
                        {/* Image placeholder - replace when you add faculty photos */}
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h4 className="text-2xl font-bold text-terracotta-red mb-2">
                        {member.name}
                      </h4>
                      <p className="arabic-text text-sage-green mb-2 text-lg">
                        {member.arabicName}
                      </p>
                      <p className="text-wood font-semibold mb-4">
                        {member.position}
                      </p>
                      <p className="text-deep-teal mb-4 text-sm leading-relaxed">
                        {member.bio.substring(0, 200)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.languages.map((lang) => (
                          <span key={lang} className="bg-sage-green/20 text-sage-green px-2 py-1 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-terracotta-red hover:text-terracotta-red-dark font-semibold transition-colors duration-200"
                      >
                        View Full Profile →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Department Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                selectedDepartment === 'all'
                  ? 'bg-terracotta-red text-warm-white shadow-lg'
                  : 'bg-soft-beige-lightest text-deep-teal hover:bg-soft-beige border border-soft-beige'
              }`}
            >
              All Faculty
            </button>
            {facultyData.departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center ${
                  selectedDepartment === dept.id
                    ? 'bg-terracotta-red text-warm-white shadow-lg'
                    : 'bg-soft-beige-lightest text-deep-teal hover:bg-soft-beige border border-soft-beige'
                }`}
              >
                <span className="mr-2">{dept.icon}</span>
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredFaculty.filter(member => !member.featured).map((member) => (
            <div key={member.id} className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 bg-soft-beige flex items-center justify-center">
                <div className="text-6xl text-terracotta-red">👤</div>
                {/* Image placeholder - replace when you add faculty photos */}
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-terracotta-red mb-2">
                  {member.name}
                </h4>
                <p className="arabic-text text-sage-green mb-2">
                  {member.arabicName}
                </p>
                <p className="text-wood font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-deep-teal text-sm mb-4">
                  {member.specialization}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.subjects.slice(0, 3).map((subject) => (
                    <span key={subject} className="bg-terracotta-red/10 text-terracotta-red px-2 py-1 rounded text-xs">
                      {subject}
                    </span>
                  ))}
                  {member.subjects.length > 3 && (
                    <span className="text-sage-green text-xs px-2 py-1">
                      +{member.subjects.length - 3} more
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-2 rounded-lg font-semibold transition-colors duration-300"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Member Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-warm-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-terracotta-red mb-2">
                      {selectedMember.name}
                    </h3>
                    <p className="arabic-text text-sage-green text-xl mb-2">
                      {selectedMember.arabicName}
                    </p>
                    <p className="text-wood font-semibold text-lg">
                      {selectedMember.position}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-deep-teal hover:text-terracotta-red text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Biography</h4>
                      <p className="text-deep-teal leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Experience</h4>
                      <p className="text-deep-teal">
                        {selectedMember.experience}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Specialization</h4>
                      <p className="text-deep-teal">
                        {selectedMember.specialization}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Qualifications</h4>
                      <ul className="text-deep-teal space-y-1">
                        {selectedMember.qualifications.map((qual, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-sage-green mr-2">•</span>
                            {qual}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.subjects.map((subject) => (
                          <span key={subject} className="bg-sage-green/20 text-sage-green px-3 py-1 rounded-full text-sm">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-terracotta-red mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.languages.map((lang) => (
                          <span key={lang} className="bg-wood/20 text-wood px-3 py-1 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedMember.achievements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-terracotta-red mb-3">Achievements</h4>
                        <ul className="text-deep-teal space-y-1">
                          {selectedMember.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-wood mr-2">🏆</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4">
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="inline-flex items-center bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                      >
                        <span className="mr-2">📧</span>
                        Contact {selectedMember.name.split(' ')[0]}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}