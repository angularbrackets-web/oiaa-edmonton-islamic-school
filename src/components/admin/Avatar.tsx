import { useState } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

interface AvatarProps {
  src?: string
  alt: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm', 
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  // Check if the image source is from a valid CDN/image service
  const isValidImageUrl = (url: string) => {
    if (!url) return false
    return url.includes('supabase.co') || 
           url.includes('supabase.in') || 
           url.includes('cloudinary.com') ||
           url.includes('res.cloudinary.com') ||
           url.startsWith('http://') || 
           url.startsWith('https://')
  }

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-terracotta-red',
      'bg-sage-green', 
      'bg-deep-teal',
      'bg-wood',
      'bg-amber-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // Get fallback avatar URL - using UI Avatars service
  const getFallbackAvatar = (name: string, size: string) => {
    const sizeMap = { xs: 32, sm: 48, md: 64, lg: 96, xl: 128 }
    const pixelSize = sizeMap[size as keyof typeof sizeMap]
    const initials = getInitials(name)
    // Using a neutral color scheme for Islamic school context
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${pixelSize}&background=e5ddd5&color=8b4513&format=svg&rounded=true&font-size=0.33`
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover border-2 border-soft-beige flex-shrink-0 ${className}`

  // Only use image if it's from a valid URL and hasn't errored
  const validImageSrc = src && isValidImageUrl(src) && !imageError ? src : null

  // If we have a valid image source, show it
  if (validImageSrc) {
    return (
      <div className="relative">
        <div className={`${baseClasses} bg-soft-beige-lightest flex items-center justify-center`}>
          <img
            src={validImageSrc}
            alt={alt}
            className={`${baseClasses} bg-transparent`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        {imageLoading && (
          <div className={`${baseClasses} bg-gray-200 animate-pulse absolute inset-0 flex items-center justify-center`}>
            <UserIcon className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
      </div>
    )
  }

  // If no valid image URL, try to use the fallback avatar service
  if (!src || !isValidImageUrl(src)) {
    return (
      <div className="relative">
        <div className={`${baseClasses} bg-soft-beige-lightest flex items-center justify-center`}>
          <img
            src={getFallbackAvatar(name, size)}
            alt={alt}
            className={`${baseClasses} bg-transparent`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        {imageLoading && (
          <div className={`${baseClasses} bg-gray-200 animate-pulse absolute inset-0 flex items-center justify-center`}>
            <UserIcon className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
      </div>
    )
  }

  // Final fallback to initials with colored background (if external service fails)
  return (
    <div className={`${baseClasses} ${getAvatarColor(name)} flex items-center justify-center text-white font-semibold`}>
      {getInitials(name)}
    </div>
  )
}