import { CardsBlockContent } from '@/types/cms'
import Link from 'next/link'

interface CardsBlockProps {
  content: CardsBlockContent
}

export default function CardsBlock({ content }: CardsBlockProps) {
  if (!content.cards || content.cards.length === 0) {
    return null
  }

  const columns = content.columns || 3
  const cardStyle = content.card_style || 'elevated'

  // Support 1 column (full-width)
  const gridClass = {
    1: '', // Single column, full width
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns] || 'md:grid-cols-3'

  const cardStyleClasses = {
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'border-2 border-gray-200 hover:border-terracotta-red transition-colors',
    flat: 'hover:bg-gray-100 transition-colors'
  }[cardStyle]

  // Helper function to detect if media is a video
  const isVideo = (url: string) => {
    return url && (
      url.includes('.mp4') ||
      url.includes('.webm') ||
      url.includes('.mov') ||
      url.includes('video')
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
          {content.cards.map((card, index) => {
            // Get image dimensions
            const imageWidth = card.image_width || '100%'
            const imageHeight = card.image_height || 'auto'
            const imageBgColor = card.image_background_color || '#f3f4f6'
            const bodyBgColor = card.body_background_color || '#ffffff'

            // Default background for card based on style
            const cardBgClass = cardStyle === 'flat' ? 'bg-gray-50' : ''

            // Full width card spans all columns
            const fullWidthClass = card.full_width ? 'md:col-span-full' : ''

            return (
              <div
                key={index}
                className={`rounded-lg overflow-hidden ${cardStyleClasses} ${cardBgClass} ${fullWidthClass}`}
                style={{ backgroundColor: cardStyle !== 'flat' ? bodyBgColor : undefined }}
              >
                {/* Card Media (Image or Video) */}
                {card.image && (
                  <div
                    className="relative w-full overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundColor: imageBgColor,
                      minHeight: imageHeight === 'auto' ? '12rem' : imageHeight
                    }}
                  >
                    {isVideo(card.image) ? (
                      <video
                        src={card.image}
                        className="object-cover"
                        style={{
                          width: imageWidth,
                          height: imageHeight === 'auto' ? '100%' : imageHeight,
                          maxWidth: '100%'
                        }}
                        controls
                        playsInline
                      />
                    ) : (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="object-cover"
                        style={{
                          width: imageWidth,
                          height: imageHeight === 'auto' ? '100%' : imageHeight,
                          maxWidth: '100%'
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Card Content */}
                <div
                  className="p-6"
                  style={{ backgroundColor: bodyBgColor }}
                >
                  <h3 className="text-xl font-bold text-deep-teal mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {card.description}
                  </p>

                  {/* Card Button */}
                  {card.button_text && card.button_url && (
                    <Link
                      href={card.button_url}
                      className="inline-block px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold"
                    >
                      {card.button_text}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
