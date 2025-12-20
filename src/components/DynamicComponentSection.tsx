/**
 * Dynamic Component Section
 *
 * Renders a reusable component on the home page by fetching its blocks and displaying them.
 * This is used when a component_id is present in a home section.
 */

import { ReusableComponent, BlockConfiguration, ContentBlock, HomeSection } from '@/types/cms'
import { componentsService } from '@/lib/supabase/components'
import BlockRenderer from './blocks/BlockRenderer'

interface DynamicComponentSectionProps {
  section: HomeSection
}

export default async function DynamicComponentSection({ section }: DynamicComponentSectionProps) {
  if (!section.component_id) {
    return null
  }

  // Fetch the component
  const component: ReusableComponent | null = await componentsService.getById(section.component_id)

  if (!component) {
    console.warn(`Component not found for home section: ${section.section_name}`)
    return null
  }

  if (!component.is_active) {
    return null // Don't render inactive components
  }

  // Convert BlockConfiguration to ContentBlock format for rendering
  const blocksToRender: ContentBlock[] = component.blocks_config.map((blockConfig: BlockConfiguration, index: number) => ({
    id: `${component.id}-block-${index}`,
    page_id: '', // Not associated with a specific page
    parent_block_id: null,
    block_type: blockConfig.block_type,
    content: blockConfig.content,
    content_ar: blockConfig.content_ar || null,
    display_order: index,
    is_visible: true,
    ...blockConfig.styling // Spread styling properties (container_width, padding, etc.)
  } as ContentBlock))

  // Get section config for styling
  const config = section.config || {}

  // Determine padding based on config or use default
  const paddingClass = config.padding === 'none' ? '' :
                       config.padding === 'small' ? 'py-8' :
                       config.padding === 'large' ? 'py-32' :
                       'py-16' // default medium padding

  return (
    <section
      className={`dynamic-component-section ${paddingClass}`}
      style={{
        backgroundColor: config.backgroundColor || undefined
      }}
    >
      {/* Render component blocks */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          {blocksToRender.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </section>
  )
}
