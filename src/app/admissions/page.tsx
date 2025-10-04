'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle, Calendar, FileText, Users, Mail, Phone } from 'lucide-react'

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const admissionSteps = [
    {
      step: 1,
      title: 'Submit Application',
      description: 'Complete our online application form with student and family information',
      icon: FileText
    },
    {
      step: 2,
      title: 'Schedule Campus Tour',
      description: 'Visit our campus, meet teachers, and see our facilities firsthand',
      icon: Calendar
    },
    {
      step: 3,
      title: 'Interview & Assessment',
      description: 'Meet with our admissions team and complete student assessment',
      icon: Users
    },
    {
      step: 4,
      title: 'Enrollment Decision',
      description: 'Receive admission decision and complete enrollment process',
      icon: CheckCircle
    }
  ]

  const requirements = [
    {
      category: 'Required Documents',
      items: [
        'Completed application form',
        'Birth certificate or passport',
        'Previous school records/transcripts',
        'Immunization records',
        'Two passport-sized photos',
        'Parent/Guardian identification'
      ]
    },
    {
      category: 'Academic Requirements',
      items: [
        'Age-appropriate grade level placement',
        'English language proficiency assessment',
        'Previous academic records review',
        'Student interview and assessment'
      ]
    },
    {
      category: 'Family Commitment',
      items: [
        'Commitment to Islamic values and ethos',
        'Agreement to school policies and handbook',
        'Active parent involvement in student education',
        'Tuition and fee payment plan agreement'
      ]
    }
  ]

  const tuitionInfo = [
    { grade: 'Kindergarten', monthly: '$650', annual: '$6,500' },
    { grade: 'Elementary (Grades 1-6)', monthly: '$700', annual: '$7,000' },
    { grade: 'Middle School (Grades 7-9)', monthly: '$750', annual: '$7,500' },
    { grade: 'High School (Grades 10-12)', monthly: '$850', annual: '$8,500' }
  ]

  const faqs = [
    {
      question: 'When does the application process begin?',
      answer: 'Applications are accepted year-round, but we encourage families to apply early. Priority enrollment begins in January for the following academic year starting in September.'
    },
    {
      question: 'Is financial assistance available?',
      answer: 'Yes, we offer financial assistance to qualifying families. Please contact our admissions office to discuss your family\'s situation and available options.'
    },
    {
      question: 'What is your student-teacher ratio?',
      answer: 'We maintain small class sizes with a student-teacher ratio of 15:1 in elementary and 20:1 in secondary to ensure personalized attention and quality instruction.'
    },
    {
      question: 'Do you offer before and after school programs?',
      answer: 'Yes, we offer extended care from 7:00 AM to 6:00 PM for working families. This includes homework support, enrichment activities, and Islamic education.'
    },
    {
      question: 'What curriculum do you follow?',
      answer: 'We follow the Alberta Education curriculum integrated with comprehensive Islamic studies, Arabic language, and Quran memorization programs.'
    },
    {
      question: 'Can students transfer mid-year?',
      answer: 'Yes, we accept mid-year transfers subject to availability. Please contact admissions to discuss your specific situation and timing.'
    }
  ]

  return (
    <main className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-deep-teal to-sage-green py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-geometric.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-6">Join OIA Academy</h1>
          <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl mx-auto mb-8">
            Begin your child's journey to excellence in Islamic education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="bg-warm-white text-deep-teal px-8 py-4 rounded-lg font-semibold text-lg hover:bg-soft-beige transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Apply Now
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-warm-white text-warm-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-warm-white/10 transition-all duration-300"
            >
              Schedule Tour
            </a>
          </div>
        </div>
      </section>

      {/* Admission Process Timeline */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">Admission Process</h2>
            <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
              Four simple steps to join our Islamic educational community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-soft-beige hover:shadow-xl transition-all duration-300">
                    <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-terracotta-red to-terracotta-red-dark rounded-full flex items-center justify-center text-warm-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                    <div className="mt-6 mb-4">
                      <IconComponent className="w-12 h-12 text-terracotta-red" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teal mb-3">{step.title}</h3>
                    <p className="text-deep-teal/70">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">Admission Requirements</h2>
            <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
              What you'll need to complete the application process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-soft-beige">
                <h3 className="text-2xl font-bold text-terracotta-red mb-6">{req.category}</h3>
                <ul className="space-y-3">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-sage-green flex-shrink-0 mt-1" />
                      <span className="text-deep-teal">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition & Fees */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">Tuition & Fees</h2>
            <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
              Transparent pricing for quality Islamic education
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-soft-beige overflow-hidden">
              <div className="bg-gradient-to-r from-terracotta-red to-terracotta-red-dark p-6">
                <h3 className="text-2xl font-bold text-warm-white text-center">2024-2025 Tuition</h3>
              </div>
              <div className="divide-y divide-soft-beige">
                {tuitionInfo.map((item, index) => (
                  <div key={index} className="p-6 flex justify-between items-center hover:bg-soft-beige/30 transition-colors">
                    <span className="text-lg font-semibold text-deep-teal">{item.grade}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-terracotta-red">{item.monthly}/month</div>
                      <div className="text-sm text-deep-teal/70">{item.annual} annually</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-soft-beige/50 p-6">
                <p className="text-center text-deep-teal">
                  <strong>Includes:</strong> Tuition, Islamic studies, Arabic classes, field trips, and most materials
                </p>
                <p className="text-center text-deep-teal/70 mt-2 text-sm">
                  Additional fees may apply for uniforms, extended care, and optional programs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-deep-teal/70">Common questions about admissions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-soft-beige overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-soft-beige/30 transition-colors"
                >
                  <span className="text-lg font-semibold text-deep-teal pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-terracotta-red flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-deep-teal/80 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-gradient-to-br from-deep-teal to-sage-green">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-white mb-6">Ready to Apply?</h2>
          <p className="text-xl text-warm-white/90 mb-12 max-w-2xl mx-auto">
            Our admissions team is here to guide you through every step of the process
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a
              href="tel:+17801234567"
              className="bg-white/10 backdrop-blur-sm border-2 border-warm-white/30 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-8 h-8 text-warm-white mx-auto mb-3" />
              <div className="text-warm-white font-semibold mb-1">Call Us</div>
              <div className="text-warm-white/80">(780) 123-4567</div>
            </a>

            <a
              href="mailto:academy@oiacedmonton.ca"
              className="bg-white/10 backdrop-blur-sm border-2 border-warm-white/30 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <Mail className="w-8 h-8 text-warm-white mx-auto mb-3" />
              <div className="text-warm-white font-semibold mb-1">Email Us</div>
              <div className="text-warm-white/80">academy@oiacedmonton.ca</div>
            </a>
          </div>

          <a
            id="apply"
            href="/contact"
            className="inline-block bg-warm-white text-deep-teal px-12 py-4 rounded-lg font-bold text-lg hover:bg-soft-beige transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Start Your Application
          </a>
        </div>
      </section>
    </main>
  )
}
