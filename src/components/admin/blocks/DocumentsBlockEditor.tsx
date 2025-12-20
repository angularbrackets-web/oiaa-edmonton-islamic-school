'use client'

import { useState } from 'react'
import { DocumentsBlockContent, DocumentItem } from '@/types/cms'
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface DocumentsBlockEditorProps {
  content: DocumentsBlockContent
  onChange: (content: DocumentsBlockContent) => void
}

export default function DocumentsBlockEditor({ content, onChange }: DocumentsBlockEditorProps) {
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null)
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null)

  // Generate unique ID for new documents
  const generateDocId = () => {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Handle file upload
  const handleFileUpload = async (index: number, file: File) => {
    setUploadingDoc(index)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'documents')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Update document with uploaded file URL
        updateDocument(index, {
          url: result.url,
          title: content.documents[index].title || file.name.replace(/\.[^/.]+$/, ''),
          size: `${(file.size / 1024).toFixed(1)} KB`
        })
      } else {
        alert(`Upload failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploadingDoc(null)
    }
  }

  // Add new document
  const addDocument = () => {
    const newDoc: DocumentItem = {
      id: generateDocId(),
      title: 'New Document',
      url: '',
      type: 'pdf',
      description: ''
    }
    onChange({
      ...content,
      documents: [...content.documents, newDoc]
    })
    setExpandedDoc(content.documents.length)
  }

  // Remove document
  const removeDocument = (index: number) => {
    onChange({
      ...content,
      documents: content.documents.filter((_, i) => i !== index)
    })
    if (expandedDoc === index) {
      setExpandedDoc(null)
    }
  }

  // Update document
  const updateDocument = (index: number, updates: Partial<DocumentItem>) => {
    const newDocs = [...content.documents]
    newDocs[index] = { ...newDocs[index], ...updates }
    onChange({ ...content, documents: newDocs })
  }

  // Move document up
  const moveDocUp = (index: number) => {
    if (index === 0) return
    const newDocs = [...content.documents]
    ;[newDocs[index - 1], newDocs[index]] = [newDocs[index], newDocs[index - 1]]
    onChange({ ...content, documents: newDocs })
    if (expandedDoc === index) {
      setExpandedDoc(index - 1)
    } else if (expandedDoc === index - 1) {
      setExpandedDoc(index)
    }
  }

  // Move document down
  const moveDocDown = (index: number) => {
    if (index === content.documents.length - 1) return
    const newDocs = [...content.documents]
    ;[newDocs[index], newDocs[index + 1]] = [newDocs[index + 1], newDocs[index]]
    onChange({ ...content, documents: newDocs })
    if (expandedDoc === index) {
      setExpandedDoc(index + 1)
    } else if (expandedDoc === index + 1) {
      setExpandedDoc(index)
    }
  }

  return (
    <div className="space-y-6">
      {/* Block Settings */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Documents Block Settings</h3>

        {/* Block Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Block Title (optional)
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Downloads & Resources"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        {/* Block Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
            placeholder="Important documents and forms for parents and students"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        {/* Display Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Style
          </label>
          <div className="flex gap-3">
            {(['list', 'grid', 'cards'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => onChange({ ...content, display_style: style })}
                className={`px-4 py-2 border rounded-lg transition-colors capitalize ${
                  content.display_style === style
                    ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                    : 'border-gray-300 hover:border-terracotta-red'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={content.show_download !== false}
              onChange={(e) => onChange({ ...content, show_download: e.target.checked })}
              className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
            />
            <span className="text-sm text-gray-700">Show Download Button</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={content.show_preview !== false}
              onChange={(e) => onChange({ ...content, show_preview: e.target.checked })}
              className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
            />
            <span className="text-sm text-gray-700">Show Preview (PDFs only)</span>
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Documents ({content.documents.length})
          </label>
          <button
            type="button"
            onClick={addDocument}
            className="flex items-center gap-2 px-3 py-1.5 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Document
          </button>
        </div>

        {content.documents.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-3">No documents yet</p>
            <button
              type="button"
              onClick={addDocument}
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Document
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {content.documents.map((doc, index) => (
              <div
                key={doc.id}
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                {/* Document Header */}
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedDoc(expandedDoc === index ? null : index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {doc.title || 'Untitled Document'}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded uppercase">
                      {doc.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveDocUp(index)
                      }}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveDocDown(index)
                      }}
                      disabled={index === content.documents.length - 1}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeDocument(index)
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document Content (Expandable) */}
                {expandedDoc === index && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Document File URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document URL <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={doc.url}
                          onChange={(e) => updateDocument(index, { url: e.target.value })}
                          placeholder="https://example.com/document.pdf"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                        />
                        <label className={`px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                          uploadingDoc === index
                            ? 'bg-gray-100 cursor-not-allowed'
                            : 'hover:bg-gray-50 hover:border-terracotta-red'
                        }`}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(index, file)
                              }
                            }}
                            className="hidden"
                            disabled={uploadingDoc === index}
                          />
                          {uploadingDoc === index ? (
                            <>
                              <div className="w-4 h-4 border-2 border-terracotta-red border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm">Upload</span>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload a file (PDF, Word, Excel) or enter a URL manually
                      </p>
                    </div>

                    {/* Document Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => updateDocument(index, { title: e.target.value })}
                        placeholder="Student Handbook 2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocument(index, { type: e.target.value as DocumentItem['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      >
                        <option value="pdf">PDF</option>
                        <option value="word">Word Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Document Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={doc.description || ''}
                        onChange={(e) => updateDocument(index, { description: e.target.value })}
                        placeholder="A comprehensive guide for students and parents..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* File Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Size (optional)
                      </label>
                      <input
                        type="text"
                        value={doc.size || ''}
                        onChange={(e) => updateDocument(index, { size: e.target.value })}
                        placeholder="2.5 MB"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter manually (e.g., "2.5 MB", "150 KB")
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
