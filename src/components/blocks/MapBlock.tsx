import { MapBlockContent } from '@/types/cms'

interface MapBlockProps {
  content: MapBlockContent
}

export default function MapBlock({ content }: MapBlockProps) {
  // Don't render if no map data
  if (!content.embed_url && !content.address) {
    return null
  }

  const height = content.height || '400px'

  // If embed URL is provided, use iframe
  if (content.embed_url) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <iframe
            src={content.embed_url}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-lg"
            title={content.marker_title || 'Location map'}
          />
        </div>
      </div>
    )
  }

  // If only address is provided, show address card with link to Google Maps
  if (content.address) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}`

    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto border-l-4 border-terracotta-red">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-terracotta-red rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-deep-teal mb-2">
                  {content.marker_title || 'Our Location'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {content.address}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
