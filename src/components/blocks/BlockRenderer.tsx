/**
 * Block Renderer Components
 *
 * Renders different block types on the frontend with layout control
 */

import { ContentBlock, TextBlockContent, ImageBlockContent, CTABlockContent, VideoBlockContent, CardsBlockContent, PageEmbedBlockContent, ComponentBlockContent, SectionBlockContent, ColumnsBlockContent } from '@/types/cms'
import Link from 'next/link'
import VideoBlock from './VideoBlock'
import CardsBlock from './CardsBlock'
import PageEmbedBlock from './PageEmbedBlock'
import ComponentBlock from './ComponentBlock'
import SectionBlock from './SectionBlock'
import ColumnsBlock from './ColumnsBlock'
import BlockLayoutWrapper from './BlockLayoutWrapper'

interface BlockRendererProps {
  block: ContentBlock
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block.is_visible) return null

  // Wrap block content with layout wrapper
  return (
    <BlockLayoutWrapper
      containerWidth={block.container_width}
      padding={block.padding}
      paddingHorizontal={block.padding_horizontal}
      marginTop={block.margin_top}
      marginBottom={block.margin_bottom}
      marginHorizontal={block.margin_horizontal}
      backgroundColor={block.background_color}
      customClass={block.custom_css_class}
      displayStyle={block.display_style}
      cardBorderColor={block.card_border_color}
      cardBorderRadius={block.card_border_radius}
      cardShadow={block.card_shadow}
      cardHoverEffect={block.card_hover_effect}
    >
      {block.block_type === 'text' && <TextBlock content={block.content as TextBlockContent} />}
      {block.block_type === 'image' && <ImageBlock content={block.content as ImageBlockContent} />}
      {block.block_type === 'video' && <VideoBlock content={block.content as VideoBlockContent} />}
      {block.block_type === 'cards' && <CardsBlock content={block.content as CardsBlockContent} />}
      {block.block_type === 'page_embed' && <PageEmbedBlock content={block.content as PageEmbedBlockContent} />}
      {block.block_type === 'component' && <ComponentBlock content={block.content as ComponentBlockContent} />}
      {block.block_type === 'cta' && <CTABlock content={block.content as CTABlockContent} />}
      {block.block_type === 'section' && <SectionBlock block={block} />}
      {block.block_type === 'columns' && <ColumnsBlock content={block.content as ColumnsBlockContent} block={block} />}
    </BlockLayoutWrapper>
  )
}

// Text Block
function TextBlock({ content }: { content: TextBlockContent }) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }[content.alignment || 'left']

  const columns = content.columns || 1
  const columnClass = columns === 2 ? 'md:columns-2' : columns === 3 ? 'md:columns-3' : ''

  return (
    <div className={`${alignmentClass} ${columnClass}`}>
      <div
        className="prose prose-lg max-w-none prose-headings:text-deep-teal prose-a:text-terracotta-red prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: content.html || '' }}
      />
    </div>
  )
}

// Image Block
function ImageBlock({ content }: { content: ImageBlockContent }) {
  if (!content.url) return null

  const alignmentClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full'
  }[content.alignment || 'center']

  return (
    <figure className={alignmentClass}>
      <img
        src={content.url}
        alt={content.alt || ''}
        width={content.width}
        height={content.height}
        className="rounded-lg shadow-lg"
      />
      {content.caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {content.caption}
        </figcaption>
      )}
    </figure>
  )
}

// CTA Block
function CTABlock({ content }: { content: CTABlockContent }) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[content.alignment || 'center']

  return (
    <div className={alignmentClass}>
      <div className="bg-gradient-to-r from-deep-teal to-terracotta-red text-white rounded-xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
        {content.description && (
          <p className="text-lg mb-6 opacity-90">{content.description}</p>
        )}
        {content.buttons && content.buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {content.buttons.map((button, index) => {
              const buttonClass = button.style === 'primary'
                ? 'bg-white text-deep-teal hover:bg-warm-white'
                : button.style === 'secondary'
                ? 'bg-terracotta-red text-white hover:bg-terracotta-red-dark'
                : 'border-2 border-white text-white hover:bg-white/10'

              return (
                <Link
                  key={index}
                  href={button.url}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                >
                  {button.text}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
