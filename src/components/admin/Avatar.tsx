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

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover border-2 border-soft-beige flex-shrink-0 ${className}`

  // If we have a valid image source and no error, show the image
  if (src && !imageError) {
    return (
      <div className="relative">
        <div className={`${baseClasses} bg-soft-beige-lightest flex items-center justify-center`}>
          <img
            src={src}
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

  // Fallback to initials with colored background
  return (
    <div className={`${baseClasses} ${getAvatarColor(name)} flex items-center justify-center text-white font-semibold`}>
      {getInitials(name)}
    </div>
  )
}