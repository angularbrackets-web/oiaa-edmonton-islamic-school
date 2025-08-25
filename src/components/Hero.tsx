'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Calendar, Award, Users, TrendingUp, X, Volume2, VolumeX, SkipBack, SkipForward, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Camera, Filter } from 'lucide-react'

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

interface Video {
  id: string
  title: string
  url: string
  description: string
  thumbnail: string
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'students' | 'facilities' | 'events' | 'achievements'
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

interface SchoolInfo {
  school: {
    name: string
    tagline: string
    arabicText: string
  }
}

export default function Hero() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [currentAchievement, setCurrentAchievement] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [isGalleryMode, setIsGalleryMode] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'students' | 'facilities' | 'events' | 'achievements'>('all')
  const [isPaused, setIsPaused] = useState(false)


  // Videos data
  const videos: Video[] = [
    {
      id: '1',
      title: 'New Centre Preview',
      url: 'https://streamable.com/e/0kktoh',
      description: 'Take a virtual tour of our upcoming state-of-the-art facility',
      thumbnail: '/images/new-centre-thumb.jpg'
    },
    {
      id: '2', 
      title: 'School Announcement',
      url: 'https://streamable.com/e/z9cu1p',
      description: 'Latest updates and announcements from OIA Academy',
      thumbnail: '/images/announcement-thumb.jpg'
    },
    {
      id: '3',
      title: 'Student Life',
      url: '/videos/school-life.mp4',
      description: 'Experience daily life and activities at our academy',
      thumbnail: '/images/student-life-thumb.jpg'
    }
  ]

  // Gallery images data - using real images from new-centre folder
  const galleryImages: GalleryImage[] = [
    // New Centre Architectural Renderings (Facilities)
    { id: '1', src: '/uploads/images/new-center/new.oiac.1.png', alt: 'New Centre exterior view', category: 'facilities', aspectRatio: 'landscape' },
    { id: '2', src: '/uploads/images/new-center/new.oiac.2.png', alt: 'Modern Islamic architecture design', category: 'facilities', aspectRatio: 'landscape' },
    { id: '3', src: '/uploads/images/new-center/new.oiac.3.png', alt: 'Prayer hall and mosque interior', category: 'facilities', aspectRatio: 'landscape' },
    { id: '4', src: '/uploads/images/new-center/new.oiac.4.png', alt: 'Classroom facilities overview', category: 'facilities', aspectRatio: 'portrait' },
    { id: '5', src: '/uploads/images/new-center/new.oiac.5.png', alt: 'Library and study areas', category: 'facilities', aspectRatio: 'square' },
    { id: '6', src: '/uploads/images/new-center/new.oiac.6.png', alt: 'Gymnasium and sports facilities', category: 'facilities', aspectRatio: 'landscape' },
    { id: '7', src: '/uploads/images/new-center/new.oiac.7.png', alt: 'Administrative offices', category: 'facilities', aspectRatio: 'portrait' },
    { id: '8', src: '/uploads/images/new-center/new.oiac.8.png', alt: 'Cafeteria and dining hall', category: 'facilities', aspectRatio: 'square' },
    { id: '9', src: '/uploads/images/new-center/new.oiac.9.png', alt: 'Science laboratories', category: 'facilities', aspectRatio: 'landscape' },
    { id: '10', src: '/uploads/images/new-center/new.oiac.10.png', alt: 'Technology center', category: 'facilities', aspectRatio: 'portrait' },
    
    // Ground Breaking Ceremony (Events)
    { id: '11', src: '/uploads/images/new-center/ground-breaking-ceremony/MAIN.JPG', alt: 'Ground breaking ceremony - Main event', category: 'events', aspectRatio: 'landscape' },
    { id: '12', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0537.JPG', alt: 'Community gathering for ground breaking', category: 'events', aspectRatio: 'landscape' },
    { id: '13', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0546.JPG', alt: 'Islamic blessing ceremony', category: 'events', aspectRatio: 'landscape' },
    { id: '14', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0555.JPG', alt: 'Community leaders at ceremony', category: 'events', aspectRatio: 'portrait' },
    { id: '15', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0608.JPG', alt: 'Traditional ground breaking ritual', category: 'events', aspectRatio: 'square' },
    
    // More Architectural Views (Facilities continued)
    { id: '16', src: '/uploads/images/new-center/new.oiac.15.png', alt: 'Entrance and reception area', category: 'facilities', aspectRatio: 'landscape' },
    { id: '17', src: '/uploads/images/new-center/new.oiac.20.png', alt: 'Outdoor courtyard design', category: 'facilities', aspectRatio: 'square' },
    { id: '18', src: '/uploads/images/new-center/new.oiac.25.png', alt: 'Multi-purpose assembly hall', category: 'facilities', aspectRatio: 'portrait' },
    { id: '19', src: '/uploads/images/new-center/new.oiac.30.png', alt: 'Complete facility overview', category: 'facilities', aspectRatio: 'landscape' },
    
    // Additional Event Photos  
    { id: '20', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0631.JPG', alt: 'Community celebration moments', category: 'events', aspectRatio: 'landscape' },
    { id: '21', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0654.JPG', alt: 'Ceremonial proceedings', category: 'events', aspectRatio: 'portrait' },
    { id: '22', src: '/uploads/images/new-center/ground-breaking-ceremony/GP_B0681.JPG', alt: 'Community unity at groundbreaking', category: 'events', aspectRatio: 'square' },
    
    // More Facility Designs
    { id: '23', src: '/uploads/images/new-center/new.oiac.12.png', alt: 'Modern classroom technology', category: 'facilities', aspectRatio: 'landscape' },
    { id: '24', src: '/uploads/images/new-center/new.oiac.18.png', alt: 'Islamic art and decoration', category: 'facilities', aspectRatio: 'portrait' },
    { id: '25', src: '/uploads/images/new-center/new.oiac.22.png', alt: 'Sustainable building features', category: 'facilities', aspectRatio: 'square' }
  ]

  const filteredImages = galleryFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === galleryFilter)

  // Dynamic grid system with varying spans
  const [gridCycle, setGridCycle] = useState(0)
  
  const generateGridLayout = (images: GalleryImage[], cycle: number) => {
    // Create a grid layout with dynamic spans
    return images.map((image, index) => {
      // Use cycle to vary which images get larger spans
      const cycleOffset = (index + cycle) % images.length
      
      // Determine spans based on position and cycle
      const widthSpan = cycleOffset % 7 === 0 ? 2 : 1  // Every 7th image (offset by cycle) gets 2 width spans
      const heightSpan = cycleOffset % 5 === 0 ? 2 : 1 // Every 5th image (offset by cycle) gets 2 height spans
      
      return {
        ...image,
        widthSpan,
        heightSpan,
        gridPosition: index
      }
    })
  }

  const gridImages = generateGridLayout(filteredImages, gridCycle)
  
  // Change grid layout every cycle (when animation loops) - much slower cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setGridCycle(prev => prev + 1)
    }, 120000) // Change layout every 2 minutes to match animation duration
    
    return () => clearInterval(interval)
  }, [])

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

  // Separate useEffect for achievement rotation
  useEffect(() => {
    if (achievements.length === 0) return

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentAchievement(prev => {
          const nextIndex = (prev + 1) % achievements.length
          // Ensure index is valid
          return nextIndex < achievements.length ? nextIndex : 0
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, achievements.length])

  // Reset currentAchievement if it becomes invalid due to data changes
  useEffect(() => {
    if (achievements.length > 0 && currentAchievement >= achievements.length) {
      setCurrentAchievement(0)
    }
  }, [achievements, currentAchievement])

  // Key handlers for navigation and mode control
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isVideoPlaying) {
          exitVideo()
        } else if (isGalleryMode) {
          exitGallery()
        }
      } else if (!isVideoPlaying && !isGalleryMode) {
        // Achievement navigation with arrow keys (only in main hero view)
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          prevAchievement()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          nextAchievement()
        }
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVideoPlaying, isGalleryMode])



  const getAchievementIcon = (achievement: Achievement) => {
    // Use the icon field from the achievement if available, otherwise fallback to type
    const iconName = achievement.icon || (
      achievement.type === 'academic' ? 'Award' : 
      achievement.type === 'community' ? 'Users' : 
      achievement.type === 'construction' ? 'TrendingUp' : 'Award'
    )

    switch (iconName) {
      case 'Award': return Award
      case 'Users': return Users
      case 'TrendingUp': return TrendingUp
      default: return Award
    }
  }

  const nextVideo = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length)
    setIsPlaying(true)
  }

  const prevVideo = () => {
    setCurrentVideo(prev => prev === 0 ? videos.length - 1 : prev - 1)
    setIsPlaying(true)
  }

  const exitVideo = () => {
    setIsVideoPlaying(false)
    setCurrentVideo(0)
    setIsMuted(true)
    setIsPlaying(true)
  }

  const exitGallery = () => {
    setIsGalleryMode(false)
    setGalleryFilter('all')
  }

  const rewindVideo = () => {
    if (videoRef) {
      videoRef.currentTime = Math.max(0, videoRef.currentTime - 10)
    }
  }

  const forwardVideo = () => {
    if (videoRef) {
      videoRef.currentTime = Math.min(videoRef.duration, videoRef.currentTime + 10)
    }
  }

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause()
      } else {
        videoRef.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextAchievement = () => {
    if (achievements.length === 0) return
    setCurrentAchievement(prev => {
      const nextIndex = (prev + 1) % achievements.length
      return nextIndex < achievements.length ? nextIndex : 0
    })
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume auto-rotation after 10 seconds
  }

  const prevAchievement = () => {
    if (achievements.length === 0) return
    setCurrentAchievement(prev => {
      const prevIndex = prev === 0 ? achievements.length - 1 : prev - 1
      return prevIndex >= 0 && prevIndex < achievements.length ? prevIndex : 0
    })
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume auto-rotation after 10 seconds
  }

  const goToAchievement = (index: number) => {
    if (achievements.length === 0 || index < 0 || index >= achievements.length) return
    setCurrentAchievement(index)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume auto-rotation after 10 seconds
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video/Gallery/Background */}
      <div className="absolute inset-0">
        {isGalleryMode ? (
          /* Gallery Mode - Dynamic Grid Infinite Scroll */
          <div className="relative w-full h-full overflow-hidden">
            {/* CSS Grid Container - Infinite Scroll */}
            <motion.div 
              className="grid grid-cols-4 gap-6 p-6 w-full"
              style={{ 
                gridAutoRows: '240px', // Base row height
                height: 'fit-content',
                willChange: 'transform', // Optimize for smooth animation
                backfaceVisibility: 'hidden' // Prevent flickering
              }}
              animate={{ 
                y: [0, `-${gridImages.length * 280}px`] // Adjusted for smoother calculation
              }}
              transition={{
                duration: 120, // Much slower - 2 minutes for full cycle
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              key={gridCycle} // Force re-render when cycle changes
            >
              {/* Triple the grid for smooth infinite scroll */}
              {[...gridImages, ...gridImages, ...gridImages].map((image, index) => (
                <motion.div
                  key={`${image.id}-${index}-${gridCycle}`}
                  className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                  style={{
                    gridColumn: `span ${image.widthSpan}`,
                    gridRow: `span ${image.heightSpan}`
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
                    delay: (index % gridImages.length) * 0.02,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 30,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  {/* Prominent foreground image */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover brightness-100 contrast-105 saturate-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  
                  {/* Fallback with better visibility */}
                  <div className="w-full h-full bg-gradient-to-br from-soft-beige-light to-terracotta-red/20 flex items-center justify-center" style={{ display: 'none' }}>
                    <Camera className="w-12 h-12 text-terracotta-red/60" />
                  </div>
                  
                  {/* Hover overlay - REMOVED for pure image viewing */}
                  
                  {/* Enhanced text overlay on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-base font-semibold leading-tight drop-shadow-lg">{image.alt}</p>
                  </div>
                  
                  {/* Enhanced border and shadow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/25 transition-all duration-300 shadow-xl"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : isVideoPlaying ? (
          <div className="relative w-full h-full">
            {/* Video Player */}
            <div className="absolute inset-0">
              {videos[currentVideo].url.includes('streamable.com') ? (
                <iframe
                  className="w-full h-full object-cover"
                  src={`${videos[currentVideo].url}?autoplay=1&muted=${isMuted ? 1 : 0}&loop=1`}
                  style={{ border: 0 }}
                  allowFullScreen
                  allow="autoplay; fullscreen"
                />
              ) : (
                <video
                  ref={setVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                >
                  <source src={videos[currentVideo].url} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Video Controls Overlay - REMOVED for cleaner experience */}
            
            {/* Video Controls - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/70 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 border border-white/30 shadow-lg"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={exitVideo}
                className="bg-black/70 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 border border-white/30 shadow-lg"
                title="Exit Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Navigation Arrows */}
            {videos.length > 1 && (
              <>
                <button
                  onClick={prevVideo}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 z-20 border border-white/30 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextVideo}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 z-20 border border-white/30 shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Compact Video Controls */}
            {!videos[currentVideo].url.includes('streamable.com') && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/30 shadow-lg">
                  <button
                    onClick={rewindVideo}
                    className="text-white/80 hover:text-white p-1 transition-colors duration-200"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="text-white hover:text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={forwardVideo}
                    className="text-white/80 hover:text-white p-1 transition-colors duration-200"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Video Titles Bar */}
            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30 shadow-lg">
                <div className="flex items-center gap-4 text-sm">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center">
                      <button
                        onClick={() => {
                          setCurrentVideo(index)
                          setIsPlaying(true)
                        }}
                        className={`relative transition-all duration-300 whitespace-nowrap px-3 py-1 rounded-full flex items-center gap-2 ${
                          index === currentVideo 
                            ? 'bg-white/20 text-white font-semibold' 
                            : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                        }`}
                      >
                        {index === currentVideo && (
                          <motion.div
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.7, 1]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-3 h-3 bg-green-500 rounded-full shadow-lg"
                          />
                        )}
                        <span>{video.title}</span>
                      </button>
                      {index < videos.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-white/40 mx-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Hero Background - Subtle Pattern/Gradient */
          <div className="relative w-full h-full">
            {/* Islamic geometric pattern background */}
            <div className="absolute inset-0 bg-gradient-to-br from-deep-charcoal via-deep-charcoal-light to-deep-charcoal opacity-95" />
            
            {/* Subtle Islamic pattern overlay */}
            <motion.div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
              animate={{
                x: [0, 60, 0],
                y: [0, 60, 0]
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Compact Top Panel - Navbar Size */}
        {!isVideoPlaying && !isGalleryMode && (
          <motion.div 
            className="sticky top-0 z-30 bg-gradient-to-r from-black/85 via-black/80 to-black/85 backdrop-blur-xl border-b border-white/10"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left: Hero Messaging */}
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    {/* Primary Text */}
                    <motion.div 
                      className="text-terracotta-red text-sm font-bold"
                      animate={{
                        textShadow: [
                          "0 0 0px rgba(217, 119, 96, 0)",
                          "0 0 6px rgba(217, 119, 96, 0.4)",
                          "0 0 0px rgba(217, 119, 96, 0)"
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Preparing Tomorrow's Muslim Leaders Today
                    </motion.div>
                    
                    {/* School Name */}
                    <motion.h1 
                      className="text-lg font-black text-warm-white"
                      animate={{
                        textShadow: [
                          "0 0 0px rgba(245, 245, 220, 0)",
                          "0 0 4px rgba(245, 245, 220, 0.3)",
                          "0 0 0px rgba(245, 245, 220, 0)"
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      {schoolInfo?.school.name || "OIA Academy Edmonton"}
                    </motion.h1>
                    
                    {/* Arabic Text */}
                    <motion.div 
                      className="arabic-text text-sm text-sage-green hidden lg:block"
                      animate={{
                        filter: [
                          "drop-shadow(0 0 0px rgba(34, 197, 94, 0))",
                          "drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))",
                          "drop-shadow(0 0 0px rgba(34, 197, 94, 0))"
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    >
                      {schoolInfo?.school.arabicText || "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"}
                    </motion.div>
                  </div>
                </div>

                {/* Right: Media Buttons - Enhanced Animations */}
                <div className="flex items-center gap-3">
                  <motion.button 
                    onClick={() => setIsVideoPlaying(true)}
                    className="relative flex items-center gap-2 bg-black/80 hover:bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group border border-white/40 shadow-xl"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 8px 25px rgba(0, 0, 0, 0.4)",
                        "0 12px 30px rgba(239, 68, 68, 0.3)",
                        "0 8px 25px rgba(0, 0, 0, 0.4)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {/* Animated shimmer effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ["-100%", "200%"]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 3
                      }}
                    />
                    
                    {/* Pulsing play icon with glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        filter: [
                          "drop-shadow(0 0 0px rgba(239, 68, 68, 0))",
                          "drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))",
                          "drop-shadow(0 0 0px rgba(239, 68, 68, 0))"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative z-10"
                    >
                      <Play className="w-4 h-4" />
                    </motion.div>
                    
                    {/* Animated text with subtle glow */}
                    <motion.span 
                      className="text-sm font-medium relative z-10"
                      animate={{
                        textShadow: [
                          "0 0 0px rgba(255, 255, 255, 0)",
                          "0 0 8px rgba(255, 255, 255, 0.5)",
                          "0 0 0px rgba(255, 255, 255, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      Videos
                    </motion.span>
                    
                    {/* Rotating border gradient */}
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, transparent, rgba(239, 68, 68, 0.3), transparent)"
                      }}
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => setIsGalleryMode(true)}
                    className="relative flex items-center gap-2 bg-black/80 hover:bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group border border-white/40 shadow-xl"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 8px 25px rgba(0, 0, 0, 0.4)",
                        "0 12px 30px rgba(20, 184, 166, 0.3)",
                        "0 8px 25px rgba(0, 0, 0, 0.4)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }
                    }}
                  >
                    {/* Animated shimmer effect with different timing */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ["-100%", "200%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 2.5,
                        delay: 1
                      }}
                    />
                    
                    {/* Floating camera icon with teal glow */}
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                        rotate: [0, 5, -5, 0],
                        filter: [
                          "drop-shadow(0 0 0px rgba(20, 184, 166, 0))",
                          "drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))",
                          "drop-shadow(0 0 0px rgba(20, 184, 166, 0))"
                        ]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8
                      }}
                      className="relative z-10"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.div>
                    
                    {/* Animated text with teal glow */}
                    <motion.span 
                      className="text-sm font-medium relative z-10"
                      animate={{
                        textShadow: [
                          "0 0 0px rgba(255, 255, 255, 0)",
                          "0 0 8px rgba(255, 255, 255, 0.5)",
                          "0 0 0px rgba(255, 255, 255, 0)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2
                      }}
                    >
                      Gallery
                    </motion.span>
                    
                    {/* Rotating border gradient with teal accent */}
                    <motion.div 
                      className="absolute inset-0 rounded-full opacity-70"
                      style={{
                        background: "conic-gradient(from 180deg, transparent, rgba(20, 184, 166, 0.4), transparent)"
                      }}
                      animate={{
                        rotate: [0, -360]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5
                      }}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Navigation Bar - Gallery/Video modes */}
        {(isVideoPlaying || isGalleryMode) && (
          <motion.div 
            className="p-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-warm-white">
                <div className="text-sm opacity-80">{isGalleryMode ? 'School Gallery' : 'Video Player'}</div>
                <div className="text-lg font-semibold">OIA Academy Edmonton</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-warm-white">
                  <div className="w-2 h-2 bg-terracotta-red rounded-full"></div>
                  <span className="text-sm">{isGalleryMode ? 'Photo Gallery' : 'Now Playing'}</span>
                </div>
                <div className="flex gap-2">
                  {isGalleryMode && (
                    <button 
                      onClick={exitGallery}
                      className="flex items-center gap-2 bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white px-5 py-3 rounded-full transition-all duration-300 border-2 border-white/40 hover:border-white/60 shadow-lg hover:shadow-xl"
                      title="Exit Gallery (Press Escape)"
                    >
                      <X className="w-5 h-5" />
                      <span className="text-sm font-medium">Exit Gallery</span>
                    </button>
                  )}
                  {isVideoPlaying && (
                    <button 
                      onClick={exitVideo}
                      className="flex items-center gap-2 bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white px-5 py-3 rounded-full transition-all duration-300 border-2 border-white/40 hover:border-white/60 shadow-lg hover:shadow-xl"
                      title="Exit Video (Press Escape)"
                    >
                      <X className="w-5 h-5" />
                      <span className="text-sm font-medium">Exit Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Text Overlay Panel - 40% Width */}
          {!isVideoPlaying && !isGalleryMode && (
            <motion.div 
              className="w-2/5 relative z-20 flex flex-col justify-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Semi-transparent Dark Charcoal Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70 backdrop-blur-sm" />
              
              <div className="relative z-10 px-12 py-16 flex flex-col h-full">
                {/* Animated Achievement Content */}
                <div className="flex-1">
                  {achievements.length > 0 && achievements[currentAchievement] && currentAchievement < achievements.length && (
                    <motion.div
                      key={currentAchievement}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-6"
                    >
                      {/* Category Label (Top) */}
                      <motion.div 
                        className="text-terracotta-red font-semibold text-sm tracking-[0.2em] uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {achievements[currentAchievement].type === 'construction' ? 'NEW CONSTRUCTION' : 'LATEST ACHIEVEMENT'}
                      </motion.div>

                      {/* Main Headline (Middle) */}
                      <motion.h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {achievements[currentAchievement].title}
                      </motion.h1>

                      {/* Subheading (Bottom) */}
                      <motion.p 
                        className="text-white/80 text-lg font-normal leading-relaxed max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        {achievements[currentAchievement].description}
                      </motion.p>

                      {/* Navigation Controls */}
                      <motion.div 
                        className="flex items-center gap-6 pt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        {/* Achievement dots navigation */}
                        <div className="flex gap-2">
                          {achievements.map((_, index) => (
                            <motion.button
                              key={index}
                              onClick={() => goToAchievement(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none ${
                                index === currentAchievement ? 'bg-terracotta-red' : 'bg-white/30 hover:bg-white/50'
                              }`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-3">
                          <motion.button
                            onClick={prevAchievement}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={nextAchievement}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Static Call to Action Section - Always Visible */}
                <div className="flex flex-col gap-4 pt-8 border-t border-white/10 mt-8">
                  <div className="flex gap-3">
                    <motion.button 
                      className="relative bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg overflow-hidden text-sm flex-1"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 20px rgba(217, 119, 96, 0.4)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Book School Tour</span>
                    </motion.button>
                    
                    <motion.button 
                      className="relative border border-white/50 hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 overflow-hidden text-sm flex-1"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 20px rgba(255, 255, 255, 0.2)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Admission Guide</span>
                    </motion.button>
                  </div>

                  {/* Compact Live Stats */}
                  <div className="flex justify-between text-center pt-4">
                    {[
                      { number: "15+", label: "Years" },
                      { number: "500+", label: "Students" },
                      { number: "98%", label: "University" }
                    ].map((stat, index) => (
                      <div key={index}>
                        <div className="text-lg font-black text-terracotta-red mb-1">
                          {stat.number}
                        </div>
                        <div className="text-white/70 text-xs font-medium">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Side - Full Media Display (60% Width) */}
          <div className={`${!isVideoPlaying && !isGalleryMode ? 'w-3/5' : 'w-full'} relative`}>
            {!isVideoPlaying && !isGalleryMode && achievements.length > 0 && achievements[currentAchievement] && currentAchievement < achievements.length && (
              <motion.div
                key={currentAchievement}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${achievements[currentAchievement]?.backgroundImage || `/images/hero-${currentAchievement + 1}.jpg`}')`,
                }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            )}

            {/* Achievement icon overlay */}
            {!isVideoPlaying && !isGalleryMode && achievements.length > 0 && achievements[currentAchievement] && currentAchievement < achievements.length && (
              <motion.div 
                className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm p-4 rounded-full z-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                {(() => {
                  const IconComponent = getAchievementIcon(achievements[currentAchievement])
                  return <IconComponent className="w-6 h-6 text-terracotta-red" />
                })()}
              </motion.div>
            )}

            {/* Date badge */}
            {!isVideoPlaying && !isGalleryMode && achievements.length > 0 && achievements[currentAchievement] && currentAchievement < achievements.length && (
              <motion.div 
                className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date(achievements[currentAchievement].date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

        </div>

        {/* Gallery Filter Controls */}
        {isGalleryMode && (
          <motion.div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg">
              <div className="flex items-center gap-6 text-sm">
                {[
                  { key: 'all', label: 'All Photos', count: galleryImages.length },
                  { key: 'facilities', label: 'New Centre', count: galleryImages.filter(img => img.category === 'facilities').length },
                  { key: 'events', label: 'Ground Breaking', count: galleryImages.filter(img => img.category === 'events').length }
                ].map((filter, index) => (
                  <div key={filter.key} className="flex items-center">
                    <button
                      onClick={() => setGalleryFilter(filter.key as any)}
                      className={`transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 ${
                        galleryFilter === filter.key
                          ? 'bg-white/20 text-white font-semibold' 
                          : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      <span>{filter.label}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{filter.count}</span>
                    </button>
                    {index < 2 && <div className="w-px h-4 bg-white/20 mx-2" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}