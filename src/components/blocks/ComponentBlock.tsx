/**
 * Component Block
 *
 * Renders a reusable component by fetching its blocks from the database
 */

import { ComponentBlockContent } from '@/types/cms'
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

  // Fetch the component with blocks from database
  const componentWithBlocks = await componentsService.getByIdWithBlocks(content.component_id)

  if (!componentWithBlocks) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>Component not found</p>
      </div>
    )
  }

  if (!componentWithBlocks.is_active) {
    return null // Don't render inactive components
  }

  // Blocks are already in the correct format from the database
  const blocksToRender = componentWithBlocks.blocks || []

  return (
    <div className="component-block">
      {/* Optional component name */}
      {content.show_name && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-deep-teal">{componentWithBlocks.name}</h3>
          {componentWithBlocks.description && (
            <p className="text-gray-600 mt-2">{componentWithBlocks.description}</p>
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
