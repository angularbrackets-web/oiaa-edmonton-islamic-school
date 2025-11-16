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

  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns]

  const cardStyleClasses = {
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'bg-white border-2 border-gray-200 hover:border-terracotta-red transition-colors',
    flat: 'bg-gray-50 hover:bg-gray-100 transition-colors'
  }[cardStyle]

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
          {content.cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden ${cardStyleClasses}`}
            >
              {/* Card Image */}
              {card.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
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
          ))}
        </div>
      </div>
    </div>
  )
}
