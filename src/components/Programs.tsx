'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  MapPin, 
  Clock, 
  Award, 
  Play, 
  X, 
  Filter,
  Camera,
  Palette,
  Music,
  Calculator,
  Globe,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  ChevronRight,
  Eye,
  Layers
} from 'lucide-react'

interface Program {
  id: string
  title: string
  age: string
  description: string
  features: string[]
  color: string
  icon: string
  tuition: number
  curriculum: string
  gradeLevel: 'elementary' | 'middle' | 'high'
  subjects: string[]
  highlights: string[]
  outcomes: string[]
}

interface AdditionalProgram {
  title: string
  description: string
  icon: string
  schedule: string
  tuition: number
}

interface StudentWork {
  id: string
  title: string
  studentName: string
  grade: string
  subject: string
  image: string
  category: 'art' | 'science' | 'writing' | 'islamic' | 'stem'
  description: string
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

interface ProgramsData {
  programs: Program[]
  additionalPrograms: AdditionalProgram[]
  studentWork: StudentWork[]
}

export default function Programs() {
  const [programsData, setProgramsData] = useState<ProgramsData | null>(null)
  const [mode, setMode] = useState<'overview' | 'explorer' | 'gallery'>('overview')
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [gradeFilter, setGradeFilter] = useState<'all' | 'elementary' | 'middle' | 'high'>('all')
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'art' | 'science' | 'writing' | 'islamic' | 'stem'>('all')
  const [gridCycle, setGridCycle] = useState(0)

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => setProgramsData(data))
      .catch(err => {
        // Mock data for development
        const mockData = {
          programs: [
            {
              id: '1',
              title: 'Elementary Program',
              age: 'Ages 6-11',
              description: 'Building strong foundations in Islamic values and academic excellence through engaging, age-appropriate curriculum.',
              features: ['Arabic Language', 'Quran Memorization', 'Core Academics', 'Character Building'],
              color: 'terracotta-red',
              icon: '📚',
              tuition: 650,
              curriculum: 'Alberta Curriculum + Islamic Studies',
              gradeLevel: 'elementary' as const,
              subjects: ['Mathematics', 'Language Arts', 'Science', 'Social Studies', 'Islamic Studies', 'Arabic'],
              highlights: ['Small class sizes (15-20 students)', 'Certified teachers', 'Daily prayer', 'Character development'],
              outcomes: ['Strong academic foundation', 'Islamic identity formation', 'Social skills development']
            },
            {
              id: '2',
              title: 'Middle School Program',
              age: 'Ages 12-14',
              description: 'Preparing young minds for high school success while deepening Islamic knowledge and personal responsibility.',
              features: ['Advanced Arabic', 'Leadership Training', 'STEM Focus', 'Community Service'],
              color: 'sage-green',
              icon: '🎓',
              tuition: 750,
              curriculum: 'Alberta Curriculum + Advanced Islamic Studies',
              gradeLevel: 'middle' as const,
              subjects: ['Advanced Mathematics', 'Sciences', 'English', 'Islamic History', 'Arabic Literature', 'Ethics'],
              highlights: ['University prep focus', 'Leadership opportunities', 'Research projects', 'Mentorship programs'],
              outcomes: ['Critical thinking skills', 'Leadership capabilities', 'University readiness']
            },
            {
              id: '3',
              title: 'High School Program',
              age: 'Ages 15-18',
              description: 'Excellence in academics and Islamic scholarship, preparing graduates for top universities and meaningful careers.',
              features: ['University Prep', 'Islamic Scholarship', 'Career Counseling', 'Internships'],
              color: 'deep-teal',
              icon: '🏆',
              tuition: 850,
              curriculum: 'Alberta High School Diploma + Islamic Studies Certificate',
              gradeLevel: 'high' as const,
              subjects: ['Advanced Placement courses', 'Islamic Philosophy', 'Arabic Literature', 'Sciences', 'Mathematics', 'Humanities'],
              highlights: ['98% university acceptance', 'Scholarship opportunities', 'Research programs', 'Career guidance'],
              outcomes: ['University acceptance', 'Islamic scholarship', 'Career readiness']
            }
          ],
          additionalPrograms: [
            {
              title: 'After School Program',
              description: 'Homework help and enrichment activities',
              icon: '⏰',
              schedule: 'Mon-Fri 3:30-6:00 PM',
              tuition: 300
            },
            {
              title: 'Summer Islamic Camp',
              description: 'Fun Islamic learning and activities',
              icon: '☀️',
              schedule: 'July-August',
              tuition: 200
            },
            {
              title: 'Weekend Quran School',
              description: 'Quran memorization and recitation',
              icon: '📖',
              schedule: 'Saturdays 9:00 AM-12:00 PM',
              tuition: 150
            }
          ],
          studentWork: [
            {
              id: '1',
              title: 'Islamic Calligraphy Art',
              studentName: 'Amira Hassan',
              grade: 'Grade 8',
              subject: 'Islamic Arts',
              image: '/uploads/images/new-center/new.oiac.18.png',
              category: 'art' as const,
              description: 'Beautiful Arabic calligraphy featuring Quranic verses',
              aspectRatio: 'portrait' as const
            },
            {
              id: '2',
              title: 'Science Fair Project',
              studentName: 'Omar Ahmed',
              grade: 'Grade 10',
              subject: 'Chemistry',
              image: '/uploads/images/new-center/new.oiac.9.png',
              category: 'science' as const,
              description: 'Renewable energy solutions inspired by Islamic principles',
              aspectRatio: 'landscape' as const
            },
            {
              id: '3',
              title: 'Creative Writing',
              studentName: 'Fatima Al-Zahra',
              grade: 'Grade 11',
              subject: 'English Literature',
              image: '/uploads/images/new-center/new.oiac.5.png',
              category: 'writing' as const,
              description: 'Award-winning short story about Islamic heritage',
              aspectRatio: 'square' as const
            },
            {
              id: '4',
              title: 'Mathematical Excellence',
              studentName: 'Yusuf Ibrahim',
              grade: 'Grade 12',
              subject: 'Advanced Mathematics',
              image: '/uploads/images/new-center/new.oiac.12.png',
              category: 'stem' as const,
              description: 'Complex problem solving and mathematical modeling',
              aspectRatio: 'landscape' as const
            },
            {
              id: '5',
              title: 'Islamic History Research',
              studentName: 'Zara Malik',
              grade: 'Grade 9',
              subject: 'Islamic Studies',
              image: '/uploads/images/new-center/new.oiac.3.png',
              category: 'islamic' as const,
              description: 'Comprehensive research on Islamic Golden Age',
              aspectRatio: 'portrait' as const
            }
          ]
        }
        setProgramsData(mockData)
      })
  }, [])

  const programs = programsData?.programs || []
  const additionalPrograms = programsData?.additionalPrograms || []
  const studentWork = programsData?.studentWork || []

  // Filter functions
  const filteredPrograms = gradeFilter === 'all' 
    ? programs 
    : programs.filter(program => program.gradeLevel === gradeFilter)

  const filteredStudentWork = galleryFilter === 'all' 
    ? studentWork 
    : studentWork.filter(work => work.category === galleryFilter)

  // Grid cycle for student work gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setGridCycle(prev => prev + 1)
    }, 120000) // 2 minutes like Hero section
    
    return () => clearInterval(interval)
  }, [])

  // Dynamic grid layout for student work
  const generateGridLayout = (works: StudentWork[], cycle: number) => {
    return works.map((work, index) => {
      const cycleOffset = (index + cycle) % works.length
      const widthSpan = cycleOffset % 7 === 0 ? 2 : 1
      const heightSpan = cycleOffset % 5 === 0 ? 2 : 1
      
      return {
        ...work,
        widthSpan,
        heightSpan,
        gridPosition: index
      }
    })
  }

  const gridStudentWork = generateGridLayout(filteredStudentWork, gridCycle)

  return (
    <div className="relative min-h-screen py-32">
      <div id="programs">
      {/* Background */}
      <div className="absolute inset-0">
        {mode === 'gallery' ? (
          /* Student Work Gallery Mode */
          <div className="relative w-full h-full bg-gradient-to-br from-soft-beige-lightest/95 to-terracotta-red/10 overflow-hidden">
            {/* CSS Grid Container - Infinite Scroll */}
            <motion.div 
              className="grid grid-cols-4 gap-6 p-6 w-full"
              style={{ 
                gridAutoRows: '240px',
                height: 'fit-content',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
              animate={{ 
                y: [0, `-${gridStudentWork.length * 280}px`]
              }}
              transition={{
                duration: 120, // 2 minutes for full cycle
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              key={gridCycle}
            >
              {/* Triple the grid for smooth infinite scroll */}
              {[...gridStudentWork, ...gridStudentWork, ...gridStudentWork].map((work, index) => (
                <motion.div
                  key={`${work.id}-${index}-${gridCycle}`}
                  className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                  style={{
                    gridColumn: `span ${work.widthSpan}`,
                    gridRow: `span ${work.heightSpan}`
                  }}
                  initial={{ 
                    opacity: 0,
                    scale: 0.95 
                  }}
                  animate={{ 
                    opacity: 1,
                    scale: 1 
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: (index % gridStudentWork.length) * 0.02,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 30,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover brightness-100 contrast-105 saturate-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  
                  <div className="w-full h-full bg-gradient-to-br from-soft-beige-light to-terracotta-red/20 flex items-center justify-center" style={{ display: 'none' }}>
                    <Palette className="w-12 h-12 text-terracotta-red/60" />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-base font-semibold leading-tight drop-shadow-lg">{work.title}</p>
                    <p className="text-white/80 text-sm mt-1">{work.studentName} • {work.grade}</p>
                    <p className="text-white/70 text-xs mt-1">{work.subject}</p>
                  </div>
                  
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/25 transition-all duration-300 shadow-xl"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Default Background */
          <div className="absolute inset-0 bg-gradient-to-br from-soft-beige-lightest via-warm-white/95 to-terracotta-red/20"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header with Multi-Modal Controls */}
        <motion.div 
          className="p-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <motion.h2 
                className="display-lg font-serif text-terracotta-red mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Academic Programs
              </motion.h2>
              <div className="w-24 h-1 bg-wood mb-6"></div>
              <motion.p 
                className="text-xl text-deep-teal max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {mode === 'gallery' 
                  ? 'Celebrating our students\' achievements and creative excellence across all subjects and grade levels.' 
                  : mode === 'explorer'
                  ? 'Interactive exploration of our comprehensive curriculum and learning pathways.'
                  : 'Excellence in Islamic education from kindergarten through high school graduation.'}
              </motion.p>
            </div>
            
            {/* Mode Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-deep-teal">
                <div className="w-2 h-2 bg-terracotta-red rounded-full"></div>
                <span className="text-sm">
                  {mode === 'overview' && 'Program Overview'}
                  {mode === 'explorer' && 'Curriculum Explorer'}
                  {mode === 'gallery' && 'Student Gallery'}
                </span>
              </div>
              <div className="flex gap-2">
                {mode === 'overview' && (
                  <>
                    <button 
                      onClick={() => setMode('explorer')}
                      className="flex items-center gap-2 bg-terracotta-red/20 hover:bg-terracotta-red/30 backdrop-blur-sm text-terracotta-red px-4 py-2 rounded-full transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Explore Programs</span>
                    </button>
                    <button 
                      onClick={() => setMode('gallery')}
                      className="flex items-center gap-2 bg-terracotta-red/20 hover:bg-terracotta-red/30 backdrop-blur-sm text-terracotta-red px-4 py-2 rounded-full transition-all duration-300"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">Student Work</span>
                    </button>
                  </>
                )}
                {(mode === 'explorer' || mode === 'gallery') && (
                  <button 
                    onClick={() => {
                      setMode('overview')
                      setSelectedProgram(null)
                      setGalleryFilter('all')
                    }}
                    className="flex items-center gap-2 bg-terracotta-red/20 hover:bg-terracotta-red/30 backdrop-blur-sm text-terracotta-red px-4 py-2 rounded-full transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Back to Overview</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <AnimatePresence mode="wait">
            {mode === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
              >
                {/* Program Filter */}
                <div className="flex justify-center mb-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                    <div className="flex items-center gap-6 text-sm">
                      {[
                        { key: 'all', label: 'All Programs', count: programs.length },
                        { key: 'elementary', label: 'Elementary', count: programs.filter(p => p.gradeLevel === 'elementary').length },
                        { key: 'middle', label: 'Middle School', count: programs.filter(p => p.gradeLevel === 'middle').length },
                        { key: 'high', label: 'High School', count: programs.filter(p => p.gradeLevel === 'high').length }
                      ].map((filter, index) => (
                        <div key={filter.key} className="flex items-center">
                          <button
                            onClick={() => setGradeFilter(filter.key as any)}
                            className={`transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 ${
                              gradeFilter === filter.key
                                ? 'bg-terracotta-red text-white font-semibold' 
                                : 'text-deep-teal hover:text-terracotta-red hover:bg-terracotta-red/10'
                            }`}
                          >
                            <Filter className="w-3 h-3" />
                            <span>{filter.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              gradeFilter === filter.key ? 'bg-white/20' : 'bg-terracotta-red/20'
                            }`}>{filter.count}</span>
                          </button>
                          {index < 3 && <div className="w-px h-4 bg-deep-teal/20 mx-2" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Program Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {filteredPrograms.map((program, index) => {
                    const getBackgroundColor = (color: string) => {
                      switch (color) {
                        case 'terracotta-red': return 'bg-terracotta-red'
                        case 'sage-green': return 'bg-sage-green'
                        case 'wood': return 'bg-wood'
                        case 'deep-teal': return 'bg-deep-teal'
                        default: return 'bg-terracotta-red'
                      }
                    }
                    
                    return (
                      <motion.div 
                        key={program.id} 
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <div className={`${getBackgroundColor(program.color)} p-8 text-center text-white relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          <div className="relative z-10">
                            <div className="text-5xl mb-4">{program.icon}</div>
                            <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                            <p className="text-lg opacity-90 mb-3">{program.age}</p>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                              <Award className="w-4 h-4" />
                              <span>{program.curriculum}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-8">
                          <p className="text-deep-teal mb-6 leading-relaxed text-lg">
                            {program.description}
                          </p>
                          
                          <div className="space-y-4 mb-6">
                            <h4 className="font-semibold text-terracotta-red text-lg mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              Key Highlights:
                            </h4>
                            {(program.highlights || program.features).slice(0, 3).map((highlight, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-wood rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-deep-teal">{highlight}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-soft-beige">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-terracotta-red">${program.tuition}</div>
                              <div className="text-deep-teal/60 text-sm">per month</div>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedProgram(program)
                                setMode('explorer')
                              }}
                              className={`${getBackgroundColor(program.color)} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center gap-2`}
                            >
                              Explore Program
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Additional Programs */}
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="display-md font-serif text-terracotta-red mb-8 text-center">Additional Programs</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {additionalPrograms.map((program, index) => (
                      <motion.div 
                        key={index} 
                        className="text-center p-6 rounded-xl bg-gradient-to-br from-soft-beige-light to-white border border-soft-beige"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      >
                        <div className="text-4xl mb-4">{program.icon}</div>
                        <h4 className="font-semibold text-deep-teal mb-3 text-lg">{program.title}</h4>
                        <p className="text-deep-teal/80 mb-2">{program.description}</p>
                        <p className="text-wood text-sm mb-2 flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4" />
                          {program.schedule}
                        </p>
                        {program.tuition > 0 && (
                          <div className="inline-flex items-center gap-1 bg-terracotta-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ${program.tuition}/month
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {mode === 'explorer' && selectedProgram && (
              <motion.div
                key="explorer"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50"
              >
                {/* Program Explorer Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">{selectedProgram.icon}</div>
                      <div>
                        <h3 className="display-md font-serif text-terracotta-red">{selectedProgram.title}</h3>
                        <p className="text-deep-teal/80 text-lg">{selectedProgram.age}</p>
                      </div>
                    </div>
                    
                    <p className="text-deep-teal text-lg leading-relaxed mb-8">{selectedProgram.description}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-terracotta-red text-lg mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Core Subjects
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(selectedProgram.subjects || []).map((subject, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-soft-beige-light p-3 rounded-lg">
                              <div className="w-2 h-2 bg-terracotta-red rounded-full"></div>
                              <span className="text-deep-teal">{subject}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-terracotta-red text-lg mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Learning Outcomes
                        </h4>
                        <div className="space-y-3">
                          {(selectedProgram.outcomes || []).map((outcome, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-wood mt-0.5 flex-shrink-0" />
                              <span className="text-deep-teal">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-soft-beige-lightest to-terracotta-red/10 p-8 rounded-2xl">
                    <h4 className="font-semibold text-terracotta-red text-xl mb-6 text-center flex items-center justify-center gap-2">
                      <Award className="w-6 h-6" />
                      Program Excellence
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-terracotta-red mb-2">${selectedProgram.tuition}</div>
                        <div className="text-deep-teal">Monthly Investment</div>
                      </div>
                      
                      <div className="bg-white/80 p-6 rounded-xl">
                        <h5 className="font-semibold text-deep-teal mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Why Choose This Program?
                        </h5>
                        <div className="space-y-3">
                          {(selectedProgram.highlights || selectedProgram.features || []).map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-wood rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-deep-teal text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 bg-terracotta-red hover:bg-terracotta-red-dark text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300">
                          Enroll Now
                        </button>
                        <button className="flex-1 border-2 border-terracotta-red hover:bg-terracotta-red hover:text-white text-terracotta-red px-4 py-3 rounded-xl font-semibold transition-all duration-300">
                          Book Tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="text-center text-white"
              >
                <div className="mb-8">
                  <h3 className="display-md font-serif text-white mb-4">Student Excellence Showcase</h3>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Discover the incredible achievements and creative works of our students across all subjects and grade levels.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Gallery Filter Controls */}
          {mode === 'gallery' && (
            <motion.div 
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="flex items-center gap-6 text-sm">
                  {[
                    { key: 'all', label: 'All Work', count: studentWork.length, icon: Layers },
                    { key: 'art', label: 'Arts', count: studentWork.filter(w => w.category === 'art').length, icon: Palette },
                    { key: 'science', label: 'Science', count: studentWork.filter(w => w.category === 'science').length, icon: Calculator },
                    { key: 'writing', label: 'Writing', count: studentWork.filter(w => w.category === 'writing').length, icon: BookOpen },
                    { key: 'islamic', label: 'Islamic', count: studentWork.filter(w => w.category === 'islamic').length, icon: Heart }
                  ].map((filter, index) => {
                    const IconComponent = filter.icon
                    return (
                      <div key={filter.key} className="flex items-center">
                        <button
                          onClick={() => setGalleryFilter(filter.key as any)}
                          className={`transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 ${
                            galleryFilter === filter.key
                              ? 'bg-white/20 text-white font-semibold' 
                              : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                          }`}
                        >
                          <IconComponent className="w-3 h-3" />
                          <span>{filter.label}</span>
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{filter.count}</span>
                        </button>
                        {index < 4 && <div className="w-px h-4 bg-white/20 mx-2" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}