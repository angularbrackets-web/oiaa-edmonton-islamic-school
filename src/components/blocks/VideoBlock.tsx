import { VideoBlockContent } from '@/types/cms'

interface VideoBlockProps {
  content: VideoBlockContent
}

// Extract video ID from YouTube or Vimeo URL
function getVideoId(url: string): { platform: 'youtube' | 'vimeo' | null; id: string | null } {
  if (!url) return { platform: null, id: null }

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ]

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match) {
      return { platform: 'youtube', id: match[1] }
    }
  }

  // Vimeo pattern
  const vimeoPattern = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoPattern)
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1] }
  }

  return { platform: null, id: null }
}

// Get embed URL for video
function getEmbedUrl(url: string, autoplay = false): string | null {
  const { platform, id } = getVideoId(url)

  if (!platform || !id) return null

  if (platform === 'youtube') {
    const autoplayParam = autoplay ? '?autoplay=1&mute=1' : ''
    return `https://www.youtube.com/embed/${id}${autoplayParam}`
  }

  if (platform === 'vimeo') {
    const autoplayParam = autoplay ? '?autoplay=1&muted=1' : ''
    return `https://player.vimeo.com/video/${id}${autoplayParam}`
  }

  return null
}

export default function VideoBlock({ content }: VideoBlockProps) {
  const videoType = content.videoType || 'embed'
  const embedUrl = videoType === 'embed' ? getEmbedUrl(content.url, content.autoplay) : null

  if (!content.url) {
    return (
      <div className="py-8 px-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">No video URL provided</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {videoType === 'embed' && embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={content.caption || 'Video'}
          />
        ) : videoType === 'upload' ? (
          <video
            src={content.url}
            controls
            autoPlay={content.autoplay}
            muted={content.autoplay}
            loop={content.autoplay}
            className="absolute inset-0 w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white">Invalid video configuration</p>
          </div>
        )}
      </div>

      {content.caption && (
        <p className="mt-4 text-center text-gray-600 italic">
          {content.caption}
        </p>
      )}
    </div>
  )
}
