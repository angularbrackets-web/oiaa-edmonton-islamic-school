'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Calendar, MapPin, Users } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'academic' | 'community' | 'construction'
  icon?: string
  backgroundImage?: string
  featured?: boolean
  order?: number
}

interface SchoolInfo {
  school: {
    name: string
    tagline: string
    arabicText: string
  }
}

export default function HeroNew() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [currentBg, setCurrentBg] = useState(0)

  // Background images from the school
  const backgroundImages = [
    '/uploads/images/new-center/new.oiac.1.png',
    '/uploads/images/new-center/new.oiac.2.png', 
    '/uploads/images/new-center/new.oiac.3.png',
    '/uploads/images/new-center/new.oiac.4.png',
    '/uploads/images/new-center/ground-breaking-ceremony/MAIN.JPG'
  ]

  useEffect(() => {
    // Load school info and achievements
    Promise.all([
      fetch('/api/school-info').then(res => res.json()),
      fetch('/api/achievements').then(res => res.json())
    ])
    .then(([schoolData, achievementsData]) => {
      setSchoolInfo(schoolData)
      setAchievements(achievementsData.achievements || [])
    })
    .catch(err => console.error('Error loading data:', err))
  }, [])

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgroundImages.length)
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Dynamic Background with Ken Burns Effect */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${image}')`,
              zIndex: index === currentBg ? 1 : 0,
            }}
            initial={{ 
              scale: 1.1, 
              opacity: 0 
            }}
            animate={{ 
              scale: index === currentBg ? 1 : 1.1,
              opacity: index === currentBg ? 1 : 0
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Status Bar */}
        <motion.div 
          className="flex justify-between items-center p-6 text-white/80 text-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Academic Year 2024-2025</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Edmonton, AB</span>
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div 
                  className="text-terracotta-red text-lg font-bold mb-4 tracking-wide"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(217, 119, 96, 0)",
                      "0 0 20px rgba(217, 119, 96, 0.5)",
                      "0 0 0px rgba(217, 119, 96, 0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  NEW SCHOOL EXPERIENCE
                </motion.div>
                
                <motion.h1 
                  className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 30px rgba(255, 255, 255, 0.3)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  Education Is What
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-red via-wood to-sage-green">
                    You Make It
                  </span>
                  <br />
                  <span className="text-4xl md:text-5xl lg:text-6xl text-sage-green">
                    in Islam
                  </span>
                </motion.h1>

                {/* Arabic Text */}
                <motion.div 
                  className="arabic-text text-2xl text-sage-green mb-8 opacity-90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  {schoolInfo?.school.arabicText || "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"}
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Endless possibilities await in our comprehensive Islamic education program. 
                Where academic excellence meets spiritual growth.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button 
                  className="group relative bg-terracotta-red hover:bg-terracotta-red-dark text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(217, 119, 96, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "200%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 3
                    }}
                  />
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button 
                  className="group border-2 border-white/50 hover:border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Video</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <motion.div 
          className="bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-xl border-t border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Quick Stats */}
              <div className="flex gap-12">
                {[
                  { 
                    icon: Users,
                    number: "500+", 
                    label: "Students Enrolled",
                    color: "text-terracotta-red"
                  },
                  { 
                    icon: Calendar,
                    number: "15+", 
                    label: "Years of Excellence",
                    color: "text-sage-green"
                  },
                  { 
                    icon: MapPin,
                    number: "98%", 
                    label: "University Acceptance",
                    color: "text-wood"
                  }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    animate={{
                      y: [0, -2, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                      <motion.div 
                        className={`text-2xl font-black ${stat.color}`}
                        animate={{
                          textShadow: [
                            "0 0 0px rgba(255, 255, 255, 0)",
                            "0 0 10px rgba(255, 255, 255, 0.3)",
                            "0 0 0px rgba(255, 255, 255, 0)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Latest Achievement Preview */}
              {achievements.length > 0 && (
                <motion.div 
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 20px rgba(255, 255, 255, 0.2)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <div className="text-white text-sm font-semibold">Latest Achievement</div>
                    <div className="text-white/70 text-xs">{achievements[0]?.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Progress Indicators */}
      <div className="absolute bottom-4 left-6 z-20 flex gap-2">
        {backgroundImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentBg(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBg ? 'bg-white' : 'bg-white/40'
            }`}
            animate={index === currentBg ? {
              scale: [1, 1.3, 1],
              boxShadow: [
                "0 0 0px rgba(255, 255, 255, 0)",
                "0 0 10px rgba(255, 255, 255, 0.8)",
                "0 0 0px rgba(255, 255, 255, 0)"
              ]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </section>
  )
}