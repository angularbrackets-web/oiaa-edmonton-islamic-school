'use client'

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BookOpen, Users, Heart, Star, Award, Globe } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: string
  color: string
}

interface SchoolInfo {
  school: {
    mission: string
  }
  features: Feature[]
}

export default function About() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch('/api/school-info')
      .then(res => res.json())
      .then(data => setSchoolInfo(data))
      .catch(err => console.error('Error loading school info:', err))
  }, [])

  const stats = [
    { number: '15+', label: 'Years of Excellence', icon: Award },
    { number: '500+', label: 'Students Served', icon: Users },
    { number: '25+', label: 'Expert Faculty', icon: BookOpen },
    { number: '100%', label: 'Islamic Values', icon: Heart }
  ]

  const timeline = [
    {
      year: '2009',
      title: 'Foundation',
      description: 'OIA Academy Edmonton was established with a vision to provide quality Islamic education',
      icon: Star
    },
    {
      year: '2015',
      title: 'Growth',
      description: 'Expanded programs and facilities to serve our growing community',
      icon: Users
    },
    {
      year: '2020',
      title: 'Innovation',
      description: 'Integrated modern technology with traditional Islamic teaching methods',
      icon: Globe
    },
    {
      year: '2025',
      title: 'New Centre',
      description: 'Breaking ground on our new state-of-the-art facility',
      icon: Award
    }
  ]
  return (
    <div id="about" ref={ref} className="py-32">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-terracotta-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sage-green/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="display-md font-serif text-center mb-8 gradient-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Story
          </motion.h2>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-terracotta-red to-wood mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 128 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
          <motion.p 
            className="text-2xl text-deep-teal max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Founded on the principles of Islamic education and modern academic excellence, 
            OIA Academy Edmonton has been nurturing minds, hearts, and souls for over a decade.
          </motion.p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div 
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-soft-beige group-hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-terracotta-red to-wood rounded-2xl flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-warm-white" />
                  </div>
                  <div className="text-4xl font-bold text-terracotta-red mb-2">{stat.number}</div>
                  <div className="text-deep-teal font-medium">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Features with Enhanced Design */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h3 className="text-4xl font-serif font-bold text-terracotta-red mb-8">What Makes Us Special</h3>
            {schoolInfo?.features?.map((feature, index) => {
              const getGradientColor = (color: string) => {
                switch (color) {
                  case 'terracotta-red': return 'from-terracotta-red to-terracotta-red-dark'
                  case 'sage-green': return 'from-sage-green to-sage-green-dark'
                  case 'wood': return 'from-wood to-wood-dark'
                  case 'deep-teal': return 'from-deep-teal to-deep-teal'
                  default: return 'from-terracotta-red to-terracotta-red-dark'
                }
              }
              
              return (
                <motion.div 
                  key={index} 
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-start space-x-6 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-soft-beige group-hover:bg-white/80 group-hover:shadow-lg transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getGradientColor(feature.color)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-warm-white text-2xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-deep-teal mb-3 group-hover:text-terracotta-red transition-colors duration-300">{feature.title}</h4>
                      <p className="text-deep-teal/80 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced Mission Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta-red/10 to-sage-green/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-soft-beige backdrop-blur-sm">
                <div className="text-center">
                  <motion.div 
                    className="text-8xl mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 1, delay: 1.6, type: "spring" }}
                  >
                    📖
                  </motion.div>
                  <h3 className="text-4xl font-serif font-bold text-terracotta-red mb-6">Our Mission</h3>
                  <p className="text-xl text-deep-teal leading-relaxed">
                    {schoolInfo?.school.mission || "To provide an exceptional educational experience that nurtures confident, compassionate, and capable Muslim leaders who will contribute positively to society while maintaining strong Islamic identity and values."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <h3 className="text-4xl font-serif font-bold text-center text-terracotta-red mb-16">Our Journey</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-terracotta-red to-sage-green rounded-full"></div>
            
            <div className="space-y-16">
              {timeline.map((item, index) => {
                const IconComponent = item.icon
                const isLeft = index % 2 === 0
                return (
                  <motion.div 
                    key={index}
                    className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 2 + index * 0.2 }}
                  >
                    <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-soft-beige">
                        <div className="text-3xl font-bold text-terracotta-red mb-2">{item.year}</div>
                        <h4 className="text-xl font-bold text-deep-teal mb-3">{item.title}</h4>
                        <p className="text-deep-teal/80">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="w-2/12 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-terracotta-red to-wood rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <IconComponent className="w-8 h-8 text-warm-white" />
                      </div>
                    </div>
                    
                    <div className="w-5/12"></div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}