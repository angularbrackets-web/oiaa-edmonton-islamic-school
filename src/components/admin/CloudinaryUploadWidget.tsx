'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface CloudinaryUploadWidgetProps {
  onSuccess: (result: {
    secure_url: string
    public_id: string
    width?: number
    height?: number
    format?: string
  }) => void
  onError?: (error: any) => void
  folder?: string
  buttonText?: string
  buttonClassName?: string
  accept?: string
}

export default function CloudinaryUploadWidget({
  onSuccess,
  onError,
  folder = 'cms/pages',
  buttonText = 'Upload Image',
  buttonClassName,
  accept = 'image/*'
}: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || `Upload failed with status ${response.status}`
        console.error('Upload failed:', errorMessage)
        throw new Error(errorMessage)
      }

      if (data.success) {
        toast.success('Image uploaded successfully!')
        onSuccess({
          secure_url: data.url,
          public_id: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
      console.error('Upload error:', error)
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      [accept]: []
    },
    multiple: false,
    noClick: true,
    noKeyboard: true
  })

  return (
    <div>
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragActive
            ? 'border-terracotta-red bg-terracotta-red/5'
            : 'border-gray-300 hover:border-terracotta-red'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />

          {uploading ? (
            <div className="space-y-2">
              <p className="text-deep-teal font-medium">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-terracotta-red h-2 rounded-full transition-all duration-300"
                  style={{ width: '50%' }}
                />
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-terracotta-red font-medium">Drop image here...</p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">
                Drag & drop an image here, or click to browse
              </p>
              <button
                type="button"
                onClick={open}
                className={
                  buttonClassName ||
                  'inline-flex items-center gap-2 px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors'
                }
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
