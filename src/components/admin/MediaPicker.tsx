'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import MediaLibrary from './MediaLibrary'

interface MediaItem {
  id: string
  url: string
  alt: string | null
  public_id: string
  folder: string | null
  file_type: string
  created_at: string
}

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  fileType?: 'image' | 'video' | 'all'
  title?: string
}

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  fileType = 'all',
  title = 'Select Media'
}: MediaPickerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const handleSelect = (media: MediaItem) => {
    setSelectedMedia(media)
  }

  const handleConfirm = () => {
    if (selectedMedia) {
      onSelect(selectedMedia)
      onClose()
      setSelectedMedia(null)
    }
  }

  const handleCancel = () => {
    onClose()
    setSelectedMedia(null)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={handleCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-deep-teal">
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Media Library */}
                <div className="mb-6 max-h-[600px] overflow-y-auto">
                  <MediaLibrary
                    onSelect={handleSelect}
                    selectedId={selectedMedia?.id}
                    fileType={fileType}
                    selectable={true}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    {selectedMedia ? (
                      <span>
                        Selected: <span className="font-medium">{selectedMedia.alt || selectedMedia.public_id.split('/').pop()}</span>
                      </span>
                    ) : (
                      <span>No media selected</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!selectedMedia}
                      className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select Media
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
