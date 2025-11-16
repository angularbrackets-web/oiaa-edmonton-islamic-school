/**
 * Component Block
 *
 * Renders a reusable component by fetching its blocks and displaying them
 */

import { ComponentBlockContent, ReusableComponent, BlockConfiguration, ContentBlock } from '@/types/cms'
import { componentsService } from '@/lib/supabase/components'
import BlockRenderer from './BlockRenderer'

interface ComponentBlockProps {
  content: ComponentBlockContent
}

export default async function ComponentBlock({ content }: ComponentBlockProps) {
  if (!content.component_id) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>No component selected</p>
      </div>
    )
  }

  // Fetch the component
  const component: ReusableComponent | null = await componentsService.getById(content.component_id)

  if (!component) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>Component not found</p>
      </div>
    )
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

  return (
    <div className="component-block">
      {/* Optional component name */}
      {content.show_name && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-deep-teal">{component.name}</h3>
          {component.description && (
            <p className="text-gray-600 mt-2">{component.description}</p>
          )}
        </div>
      )}

      {/* Render component blocks */}
      <div className="space-y-6">
        {blocksToRender.map(block => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
