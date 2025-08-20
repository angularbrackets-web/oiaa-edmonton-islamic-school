'use client'

import { useState, useEffect } from 'react'
import PrayerTimes from '@/components/PrayerTimes'
import IslamicCalendar from '@/components/IslamicCalendar'

interface JobPosition {
  id: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  posted: string
  deadline: string
  status: string
  featured: boolean
  requirements: string[]
  responsibilities: string[]
  description: string
}

interface Benefit {
  title: string
  description: string
  icon: string
}

interface VolunteerOpportunity {
  id: string
  title: string
  department: string
  commitment: string
  description: string
}

interface ApplicationStep {
  step: number
  title: string
  description: string
}

interface CareersData {
  careers: {
    title: string
    subtitle: string
    description: string
    benefits: Benefit[]
  }
  openPositions: JobPosition[]
  volunteerOpportunities: VolunteerOpportunity[]
  applicationProcess: ApplicationStep[]
}

export default function CareersPage() {
  const [careersData, setCareersData] = useState<CareersData | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null)
  const [activeTab, setActiveTab] = useState<'jobs' | 'volunteer'>('jobs')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/careers')
      .then(res => res.json())
      .then(data => {
        setCareersData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading careers data:', err)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-soft-beige rounded max-w-2xl mx-auto"></div>
            <div className="h-64 bg-soft-beige rounded"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-soft-beige rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!careersData) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta-red mb-4">
            Unable to load careers information
          </h1>
          <p className="text-deep-teal">Please try again later.</p>
        </div>
      </div>
    )
  }

  const { careers } = careersData
  const featuredJobs = careersData.openPositions.filter(job => job.featured)
  const regularJobs = careersData.openPositions.filter(job => !job.featured)

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-green to-deep-teal text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {careers.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-6">
            {careers.subtitle}
          </p>
          <p className="text-lg max-w-4xl mx-auto leading-relaxed">
            {careers.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Benefits Section */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Why Work With Us?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {careers.benefits.map((benefit, index) => (
                  <div key={index} className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="text-3xl mr-4">{benefit.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-terracotta-red mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-deep-teal">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tab Navigation */}
            <div className="flex rounded-lg bg-warm-white p-1 shadow-md border border-soft-beige max-w-md">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'jobs'
                    ? 'bg-terracotta-red text-warm-white shadow-md'
                    : 'text-deep-teal hover:bg-soft-beige-lightest'
                }`}
              >
                Job Openings ({careersData.openPositions.length})
              </button>
              <button
                onClick={() => setActiveTab('volunteer')}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'volunteer'
                    ? 'bg-terracotta-red text-warm-white shadow-md'
                    : 'text-deep-teal hover:bg-soft-beige-lightest'
                }`}
              >
                Volunteer
              </button>
            </div>

            {/* Job Openings */}
            {activeTab === 'jobs' && (
              <section>
                {/* Featured Jobs */}
                {featuredJobs.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-terracotta-red mb-6">
                      Featured Positions
                    </h3>
                    <div className="space-y-6">
                      {featuredJobs.map((job) => (
                        <div key={job.id} className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige ring-2 ring-terracotta-red/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                  Featured
                                </span>
                                <span className="bg-sage-green/20 text-sage-green px-3 py-1 rounded-full text-sm">
                                  {job.type}
                                </span>
                              </div>
                              <h4 className="text-2xl font-bold text-terracotta-red mb-2">
                                {job.title}
                              </h4>
                              <p className="text-deep-teal mb-4">
                                {job.description}
                              </p>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-sage-green">
                                  <span className="mr-2">🏢</span>
                                  <span>{job.department}</span>
                                </div>
                                <div className="flex items-center text-wood">
                                  <span className="mr-2">💰</span>
                                  <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center text-deep-teal">
                                  <span className="mr-2">📍</span>
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center text-terracotta-red">
                                  <span className="mr-2">⏰</span>
                                  <span>Apply by {formatDate(job.deadline)}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="ml-4 bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Jobs */}
                {regularJobs.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-terracotta-red mb-6">
                      Other Openings
                    </h3>
                    <div className="grid md:grid-cols-1 gap-6">
                      {regularJobs.map((job) => (
                        <div key={job.id} className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-terracotta-red mb-2">
                                {job.title}
                              </h4>
                              <p className="text-deep-teal mb-3 text-sm">
                                {job.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="text-sage-green">{job.department}</span>
                                <span className="text-wood">{job.type}</span>
                                <span className="text-deep-teal">{job.salary}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="ml-4 border-2 border-terracotta-red hover:bg-terracotta-red hover:text-warm-white text-terracotta-red px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Volunteer Opportunities */}
            {activeTab === 'volunteer' && (
              <section>
                <h3 className="text-2xl font-bold text-terracotta-red mb-6">
                  Volunteer Opportunities
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {careersData.volunteerOpportunities.map((volunteer) => (
                    <div key={volunteer.id} className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-xl font-bold text-terracotta-red mb-3">
                        {volunteer.title}
                      </h4>
                      <p className="text-deep-teal mb-3">
                        {volunteer.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-sage-green">
                          <span className="font-medium">{volunteer.department}</span>
                          <br />
                          <span>{volunteer.commitment}</span>
                        </div>
                        <button className="bg-sage-green hover:bg-sage-green-dark text-warm-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300">
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Application Process */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Application Process
              </h2>
              <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careersData.applicationProcess.map((step) => (
                    <div key={step.step} className="text-center">
                      <div className="w-12 h-12 bg-terracotta-red text-warm-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                        {step.step}
                      </div>
                      <h4 className="font-bold text-terracotta-red mb-2">
                        {step.title}
                      </h4>
                      <p className="text-deep-teal text-sm">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Islamic Calendar */}
            <IslamicCalendar />

            {/* Contact HR */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Questions?
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                Have questions about our positions or application process? Contact our HR team.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:hr@oiacedmonton.ca"
                  className="block w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
                >
                  Email HR Team
                </a>
                <a
                  href="tel:+17801234567"
                  className="block w-full border-2 border-sage-green hover:bg-sage-green hover:text-warm-white text-sage-green py-3 text-center rounded-lg font-semibold transition-all duration-300"
                >
                  Call (780) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-warm-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-terracotta-red mb-2">
                    {selectedJob.title}
                  </h3>
                  <p className="text-wood font-semibold text-lg mb-2">
                    {selectedJob.department} • {selectedJob.type}
                  </p>
                  <p className="text-sage-green font-medium">
                    {selectedJob.salary} • {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-deep-teal hover:text-terracotta-red text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h4 className="font-bold text-terracotta-red mb-3">Job Description</h4>
                    <p className="text-deep-teal leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-terracotta-red mb-3">Requirements</h4>
                    <ul className="text-deep-teal space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-sage-green mr-2 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h4 className="font-bold text-terracotta-red mb-3">Responsibilities</h4>
                    <ul className="text-deep-teal space-y-2">
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-wood mr-2 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-terracotta-red mb-3">Application Details</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-deep-teal">
                        <strong>Posted:</strong> {formatDate(selectedJob.posted)}
                      </p>
                      <p className="text-deep-teal">
                        <strong>Deadline:</strong> {formatDate(selectedJob.deadline)}
                      </p>
                      <p className="text-deep-teal">
                        <strong>Status:</strong> <span className="capitalize text-sage-green">{selectedJob.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300 mb-3">
                      Apply Now
                    </button>
                    <button className="w-full border-2 border-sage-green hover:bg-sage-green hover:text-warm-white text-sage-green py-3 rounded-lg font-semibold transition-all duration-300">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}