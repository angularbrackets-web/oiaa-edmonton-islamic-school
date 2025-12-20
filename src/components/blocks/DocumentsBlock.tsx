import { DocumentsBlockContent, DocumentItem } from '@/types/cms'
import Link from 'next/link'

interface DocumentsBlockProps {
  content: DocumentsBlockContent
}

export default function DocumentsBlock({ content }: DocumentsBlockProps) {
  if (!content.documents || content.documents.length === 0) {
    return null
  }

  const displayStyle = content.display_style || 'list'

  // Get file icon based on type
  const getFileIcon = (type: DocumentItem['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H12V9H18V20H6Z" />
          </svg>
        )
      case 'word':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M15,18H13L12,14.5L11,18H9L7,12H9L10,15.5L11,12H13L14,15.5L15,12H17L15,18Z" />
          </svg>
        )
      case 'excel':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M13,18H11L10,15L9,18H7L9,14L7,10H9L10,13L11,10H13L11,14L13,18Z" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9Z" />
          </svg>
        )
    }
  }

  // Format file size
  const formatSize = (size?: string) => {
    if (!size) return ''
    return size
  }

  const renderDocument = (doc: DocumentItem, index: number) => {
    const canPreview = content.show_preview && doc.type === 'pdf'

    return (
      <div
        key={doc.id}
        className="group hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 p-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(doc.type)}
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-deep-teal group-hover:text-terracotta-red transition-colors">
              {doc.title}
            </h4>
            {doc.description && (
              <p className="text-sm text-gray-600 mt-1">
                {doc.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="uppercase font-semibold">{doc.type}</span>
              {doc.size && <span>• {formatSize(doc.size)}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canPreview && (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-deep-teal border border-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-colors"
              >
                Preview
              </a>
            )}
            {content.show_download && (
              <a
                href={doc.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-white bg-terracotta-red rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        {(content.title || content.description) && (
          <div className="mb-8">
            {content.title && (
              <h2 className="text-3xl font-bold text-deep-teal mb-3">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p className="text-gray-600 text-lg">
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Documents - List Style */}
        {displayStyle === 'list' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-200">
            {content.documents.map((doc, index) => renderDocument(doc, index))}
          </div>
        )}

        {/* Documents - Grid Style */}
        {displayStyle === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.documents.map((doc, index) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-deep-teal">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="uppercase font-semibold">{doc.type}</span>
                        {doc.size && <span>• {formatSize(doc.size)}</span>}
                      </div>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                      {doc.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-auto">
                    {content.show_preview && doc.type === 'pdf' && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 text-sm font-medium text-deep-teal border border-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-colors text-center"
                      >
                        Preview
                      </a>
                    )}
                    {content.show_download && (
                      <a
                        href={doc.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-terracotta-red rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents - Cards Style */}
        {displayStyle === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.documents.map((doc, index) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-lg border-l-4 border-terracotta-red p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-deep-teal mb-2">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="uppercase font-semibold px-2 py-1 bg-gray-100 rounded">
                        {doc.type}
                      </span>
                      {doc.size && <span>{formatSize(doc.size)}</span>}
                    </div>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {content.show_preview && doc.type === 'pdf' && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-deep-teal border border-deep-teal rounded-lg hover:bg-deep-teal hover:text-white transition-colors"
                        >
                          Preview
                        </a>
                      )}
                      {content.show_download && (
                        <a
                          href={doc.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-white bg-terracotta-red rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
