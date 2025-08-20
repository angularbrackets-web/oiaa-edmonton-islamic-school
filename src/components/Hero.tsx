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
  const [currentAchievement, setCurrentAchievement] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [isGalleryMode, setIsGalleryMode] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'students' | 'facilities' | 'events' | 'achievements'>('all')

  // Mock achievements data - in real app would come from API
  const achievements: Achievement[] = [
    {
      id: '1',
      title: '$5M New Omar Ibn Al Khattab Centre',
      description: 'State-of-the-art 50,000 sq ft facility with modern classrooms, gymnasium, and prayer hall',
      date: '2025-08-10',
      type: 'construction'
    },
    {
      id: '2',
      title: '98% University Acceptance Rate',
      description: 'Our graduates excel in top universities across Canada including U of A, UBC, and McGill',
      date: '2025-08-08',
      type: 'academic'
    },
    {
      id: '3',
      title: 'Provincial Excellence Awards',
      description: 'Recognized for outstanding Islamic education and community leadership programs',
      date: '2025-08-05',
      type: 'community'
    }
  ]

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
    fetch('/api/school-info')
      .then(res => res.json())
      .then(data => setSchoolInfo(data))
      .catch(err => console.error('Error loading school info:', err))

    // Rotate achievements every 5 seconds
    const interval = setInterval(() => {
      setCurrentAchievement(prev => (prev + 1) % achievements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'academic': return Award
      case 'community': return Users
      case 'construction': return TrendingUp
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

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video/Gallery/Background */}
      <div className="absolute inset-0">
        {isGalleryMode ? (
          /* Gallery Mode - Dynamic Grid Infinite Scroll */
          <div className="relative w-full h-full bg-gradient-to-br from-black/5 to-black/10 overflow-hidden">
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
                  
                  {/* Minimal hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300"></div>
                  
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
                  frameBorder="0"
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

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Video Controls - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={exitVideo}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200"
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextVideo}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Compact Video Controls */}
            {!videos[currentVideo].url.includes('streamable.com') && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
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
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-2">
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
          /* Hero Image Gallery */
          <div className="relative w-full h-full">
            <motion.div
              key={currentAchievement}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/images/hero-${currentAchievement + 1}.jpg')`,
              }}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
            {/* Improved Fallback gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-soft-beige-lightest via-warm-white/95 to-terracotta-red/30"></div>
          </div>
        )}
        
        {/* Enhanced Overlay for Better Text Contrast */}
        {!isVideoPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar - Hidden when video is playing, modified for gallery */}
        {!isVideoPlaying && (
          <motion.div 
            className="p-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-warm-white">
                <div className="text-sm opacity-80">{isGalleryMode ? 'School Gallery' : 'Latest News from'}</div>
                <div className="text-lg font-semibold">OIA Academy Edmonton</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-warm-white">
                  <div className="w-2 h-2 bg-terracotta-red rounded-full"></div>
                  <span className="text-sm">{isGalleryMode ? 'Photo Gallery' : 'Recent Updates'}</span>
                </div>
                <div className="flex gap-2">
                  {!isGalleryMode && (
                    <>
                      <motion.button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="relative flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-warm-white px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 8px 25px rgba(255, 255, 255, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                            "0 0 0 4px rgba(255, 255, 255, 0.1)",
                            "0 0 0 0 rgba(255, 255, 255, 0)"
                          ]
                        }}
                        transition={{
                          boxShadow: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        {/* Animated background pulse */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 2
                          }}
                        />
                        
                        {/* Animated icon */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Play className="w-4 h-4 relative z-10" />
                        </motion.div>
                        
                        {/* Text with shimmer effect */}
                        <motion.span 
                          className="text-sm relative z-10"
                          animate={{
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          Watch Videos
                        </motion.span>
                        
                        {/* Glowing border effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-white/20"
                          animate={{
                            borderColor: [
                              "rgba(255, 255, 255, 0.2)",
                              "rgba(255, 255, 255, 0.4)",
                              "rgba(255, 255, 255, 0.2)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => setIsGalleryMode(true)}
                        className="relative flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-warm-white px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 8px 25px rgba(255, 255, 255, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0)",
                            "0 0 0 4px rgba(255, 255, 255, 0.1)",
                            "0 0 0 0 rgba(255, 255, 255, 0)"
                          ]
                        }}
                        transition={{
                          boxShadow: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.25 // Offset from first button
                          }
                        }}
                      >
                        {/* Animated background pulse - different timing */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1.5,
                            delay: 1
                          }}
                        />
                        
                        {/* Animated camera icon with different motion */}
                        <motion.div
                          animate={{
                            scale: [1, 1.15, 1],
                            y: [0, -1, 0]
                          }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        >
                          <Camera className="w-4 h-4 relative z-10" />
                        </motion.div>
                        
                        {/* Text with different fade timing */}
                        <motion.span 
                          className="text-sm relative z-10"
                          animate={{
                            opacity: [1, 0.75, 1]
                          }}
                          transition={{
                            duration: 2.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.8
                          }}
                        >
                          View Gallery
                        </motion.span>
                        
                        {/* Glowing border with offset timing */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-white/20"
                          animate={{
                            borderColor: [
                              "rgba(255, 255, 255, 0.2)",
                              "rgba(255, 255, 255, 0.4)",
                              "rgba(255, 255, 255, 0.2)"
                            ]
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                        />
                      </motion.button>
                    </>
                  )}
                  {isGalleryMode && (
                    <button 
                      onClick={exitGallery}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-warm-white px-4 py-2 rounded-full transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Exit Gallery</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <motion.div 
            className="max-w-7xl mx-auto px-6 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`grid gap-16 items-center ${isVideoPlaying || isGalleryMode ? 'grid-cols-1 justify-center text-center' : 'lg:grid-cols-2'}`}>
              {/* Left Column - Main Message */}
              <div>
                <motion.div variants={itemVariants}>
                  <div className="text-warm-white/80 text-lg mb-4">
                    Preparing Tomorrow's Muslim Leaders Today
                  </div>
                </motion.div>

                <motion.h1 
                  className="display-lg font-serif text-warm-white mb-6 leading-none"
                  variants={itemVariants}
                >
                  {schoolInfo?.school.name || "OIA Academy Edmonton"}
                </motion.h1>

                <motion.div 
                  className="arabic-text text-2xl md:text-3xl text-warm-white/90 mb-8"
                  variants={itemVariants}
                >
                  {schoolInfo?.school.arabicText || "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"}
                </motion.div>

                <motion.p 
                  className="text-xl text-warm-white/90 mb-12 max-w-2xl leading-relaxed"
                  variants={itemVariants}
                >
                  15 years of proven academic excellence, rooted in Islamic values, preparing students for university and life success.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                  variants={itemVariants}
                >
                  <button className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-xl">
                    Book Your School Tour
                  </button>
                  <button className="border-2 border-warm-white hover:bg-warm-white hover:text-terracotta-red text-warm-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300">
                    Download Admission Guide
                  </button>
                </motion.div>

                {/* Live Stats */}
                <motion.div 
                  className="grid grid-cols-3 gap-8"
                  variants={itemVariants}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warm-white mb-1">15+</div>
                    <div className="text-warm-white/80 text-sm">Years Excellence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warm-white mb-1">500+</div>
                    <div className="text-warm-white/80 text-sm">Students Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warm-white mb-1">98%</div>
                    <div className="text-warm-white/80 text-sm">University Acceptance</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Latest Achievement - Hidden when video or gallery is playing */}
              {!isVideoPlaying && !isGalleryMode && (
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
                  variants={itemVariants}
                >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-terracotta-red to-wood rounded-2xl flex items-center justify-center">
                      {(() => {
                        const IconComponent = getAchievementIcon(achievements[currentAchievement].type)
                        return <IconComponent className="w-6 h-6 text-warm-white" />
                      })()}
                    </div>
                    <div>
                      <div className="text-terracotta-red font-bold text-lg">Recent Achievement</div>
                      <div className="text-deep-teal/60 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(achievements[currentAchievement].date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {achievements.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentAchievement ? 'bg-terracotta-red' : 'bg-soft-beige'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={currentAchievement}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-deep-teal mb-4">
                    {achievements[currentAchievement].title}
                  </h3>
                  <p className="text-deep-teal/80 text-lg leading-relaxed">
                    {achievements[currentAchievement].description}
                  </p>
                </motion.div>

                <div className="mt-6 pt-6 border-t border-soft-beige">
                  <button className="text-terracotta-red font-semibold hover:text-terracotta-red-dark transition-colors duration-200">
                    Learn More →
                  </button>
                </div>
              </motion.div>
              )}
            </div>

            {/* Gallery Filter Controls */}
            {isGalleryMode && (
              <motion.div 
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3">
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}