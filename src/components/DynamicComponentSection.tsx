/**
 * Dynamic Component Section
 *
 * Renders a reusable component on the home page by fetching its blocks from the database.
 * This is used when a component_id is present in a home section.
 */

import { HomeSection } from '@/types/cms'
import { componentsService } from '@/lib/supabase/components'
import BlockRenderer from './blocks/BlockRenderer'

interface DynamicComponentSectionProps {
  section: HomeSection
}

export default async function DynamicComponentSection({ section }: DynamicComponentSectionProps) {
  if (!section.component_id) {
    return null
  }

  // Fetch the component with blocks from database
  const componentWithBlocks = await componentsService.getByIdWithBlocks(section.component_id)

  if (!componentWithBlocks) {
    console.warn(`Component not found for home section: ${section.section_name}`)
    return null
  }

  if (!componentWithBlocks.is_active) {
    return null // Don't render inactive components
  }

  // Blocks are already in the correct format from the database
  const blocksToRender = componentWithBlocks.blocks || []

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
