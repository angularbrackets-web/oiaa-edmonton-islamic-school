'use client'

import { VideoBlockContent } from '@/types/cms'
import { VideoCameraIcon } from '@heroicons/react/24/outline'
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget'
import MediaPicker from '@/components/admin/MediaPicker'
import { useState } from 'react'

interface VideoBlockEditorProps {
  content: VideoBlockContent
  onChange: (content: VideoBlockContent) => void
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
function getEmbedUrl(url: string): string | null {
  const { platform, id } = getVideoId(url)

  if (!platform || !id) return null

  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${id}`
  }

  if (platform === 'vimeo') {
    return `https://player.vimeo.com/video/${id}`
  }

  return null
}

export default function VideoBlockEditor({ content, onChange }: VideoBlockEditorProps) {
  const embedUrl = getEmbedUrl(content.url || '')
  const { platform, id } = getVideoId(content.url || '')
  const videoType = content.videoType || 'embed'
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const handleVideoUpload = (result: { secure_url: string; public_id: string }) => {
    onChange({
      ...content,
      url: result.secure_url,
      videoType: 'upload'
    })
  }

  const handleMediaSelect = (media: any) => {
    onChange({
      ...content,
      url: media.url,
      videoType: 'upload'
    })
    setShowMediaPicker(false)
  }

  return (
    <div className="space-y-4">
      {/* Video Type Tabs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Source
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onChange({ ...content, videoType: 'embed', url: '' })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              videoType === 'embed'
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📺 Embed (YouTube/Vimeo)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...content, videoType: 'upload', url: '' })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              videoType === 'upload' && !showMediaPicker
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⬆️ Upload Video
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({ ...content, videoType: 'existing' })
              setShowMediaPicker(true)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              videoType === 'existing'
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📁 Choose Existing
          </button>
        </div>
      </div>

      {/* Embed Video Section */}
      {videoType === 'embed' && (
        <>
          {/* Video URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={content.url || ''}
              onChange={(e) => onChange({ ...content, url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Supports YouTube and Vimeo URLs
            </p>
          </div>

          {/* Video Preview */}
          {embedUrl ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Platform: <span className="font-medium capitalize">{platform}</span> | ID: <span className="font-mono text-xs">{id}</span>
              </p>
            </div>
          ) : content.url ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Invalid video URL. Please enter a valid YouTube or Vimeo URL.
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Enter a video URL above to see preview</p>
            </div>
          )}
        </>
      )}

      {/* Upload Video Section */}
      {videoType === 'upload' && (
        <>
          <CloudinaryUploadWidget
            onSuccess={handleVideoUpload}
            folder="cms/videos"
            buttonText="Upload Video"
            accept="video/*"
          />

          {/* Video Preview for Uploaded Videos */}
          {content.url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={content.url}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Video URL: <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-terracotta-red hover:underline font-mono text-xs">{content.url}</a>
              </p>
            </div>
          )}
        </>
      )}

      {/* Choose Existing Video Section */}
      {videoType === 'existing' && (
        <>
          {content.url ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Video
              </label>
              <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={content.url}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Change Video
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-terracotta-red transition-colors">
              <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No video selected</p>
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                <VideoCameraIcon className="w-5 h-5" />
                Browse Media Library
              </button>
            </div>
          )}
        </>
      )}

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption (optional)
        </label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Add a caption to display below the video"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Autoplay */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoplay"
          checked={content.autoplay || false}
          onChange={(e) => onChange({ ...content, autoplay: e.target.checked })}
          className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
        />
        <label htmlFor="autoplay" className="text-sm text-gray-700">
          Autoplay video (not recommended for accessibility)
        </label>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        fileType="video"
        title="Select Video"
      />
    </div>
  )
}
