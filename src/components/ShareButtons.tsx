'use client'

import { useEffect, useState } from 'react'

interface ShareButtonsProps {
  title: string
  excerpt?: string
}

export default function ShareButtons({ title, excerpt }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt || '',
        url: currentUrl
      }).catch((error) => {
        console.log('Error sharing:', error)
      })
    } else {
      // Fallback for browsers that don't support native share
      alert('Sharing is not supported in your browser. You can copy the URL from the address bar.')
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-soft-beige">
      <h3 className="text-lg font-semibold text-deep-teal mb-4">Share this article</h3>
      <div className="flex gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          Twitter
        </a>
        <button
          onClick={handleNativeShare}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  )
}
