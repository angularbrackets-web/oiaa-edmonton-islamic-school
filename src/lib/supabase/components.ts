/**
 * Reusable Components Service - Supabase Integration
 *
 * Provides CRUD operations for reusable components and component instances
 */

import { supabase, supabaseAdmin } from '@/lib/supabase'
import {
  ReusableComponent,
  ReusableComponentInput,
  ComponentInstance,
  ComponentInstanceInput,
  ComponentWithInstances,
  ComponentUsageStats,
  BlockConfiguration,
  ContentBlockInput,
  validateComponentInput
} from '@/types/cms'
import { blocksService } from './pages'

export const componentsService = {
  /**
   * Get all reusable components (admin access)
   */
  async getAll(includeInstances = false): Promise<ReusableComponent[] | ComponentWithInstances[]> {
    const selectQuery = includeInstances
      ? `*`
      : '*'

    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .select(selectQuery)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching components:', error)
      throw new Error(`Failed to fetch components: ${error.message}`)
    }

    if (!data) return []

    if (includeInstances) {
      // Fetch instances separately for each component
      const componentsWithInstances = await Promise.all(
        data.map(async (comp: any) => {
          const { data: instances } = await supabaseAdmin
            .from('component_instances')
            .select('*')
            .eq('component_id', comp.id)

          return {
            ...(comp as ReusableComponent),
            instances: instances || []
          }
        })
      )
      return componentsWithInstances as ComponentWithInstances[]
    }

    return data as unknown as ReusableComponent[]
  },

  /**
   * Get active components only (public access)
   */
  async getActive(): Promise<ReusableComponent[]> {
    const { data, error } = await supabase
      .from('reusable_components')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching active components:', error)
      throw new Error(`Failed to fetch active components: ${error.message}`)
    }

    return (data as ReusableComponent[]) || []
  },

  /**
   * Get components by category
   */
  async getByCategory(category: string): Promise<ReusableComponent[]> {
    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error(`Error fetching components in category ${category}:`, error)
      throw new Error(`Failed to fetch components: ${error.message}`)
    }

    return (data as ReusableComponent[]) || []
  },

  /**
   * Search components by name or description
   */
  async search(query: string): Promise<ReusableComponent[]> {
    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error searching components:', error)
      throw new Error(`Failed to search components: ${error.message}`)
    }

    return (data as ReusableComponent[]) || []
  },

  /**
   * Get component by ID
   */
  async getById(id: string, includeInstances = false): Promise<ReusableComponent | ComponentWithInstances | null> {
    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error(`Error fetching component ${id}:`, error)
      throw new Error(`Failed to fetch component: ${error.message}`)
    }

    if (!data) return null

    if (includeInstances) {
      // Fetch instances separately
      const { data: instances } = await supabaseAdmin
        .from('component_instances')
        .select('*')
        .eq('component_id', id)

      return {
        ...(data as ReusableComponent),
        instances: instances || []
      } as ComponentWithInstances
    }

    return data as unknown as ReusableComponent
  },

  /**
   * Get component by ID with blocks from database
   * Fetches blocks from content_blocks table (unified system)
   */
  async getByIdWithBlocks(id: string): Promise<(ReusableComponent & { blocks: any[] }) | null> {
    // First get the component
    const component = await this.getById(id)
    if (!component) {
      return null
    }

    // Fetch blocks from content_blocks table
    const blocks = await blocksService.getByComponentId(id)

    // Build nested structure for container blocks (columns, sections)
    const topLevelBlocks = blocks.filter(b => !b.parent_block_id)
    const nestedBlocks = blocks.filter(b => b.parent_block_id)

    const blocksWithChildren = topLevelBlocks.map(block => {
      if (block.block_type === 'section' || block.block_type === 'columns') {
        return {
          ...block,
          blocks: nestedBlocks
            .filter(nb => nb.parent_block_id === block.id)
            .sort((a, b) => a.display_order - b.display_order)
        }
      }
      return block
    })

    blocksWithChildren.sort((a, b) => a.display_order - b.display_order)

    return {
      ...component,
      blocks: blocksWithChildren
    }
  },

  /**
   * Create new component
   */
  async create(input: ReusableComponentInput): Promise<ReusableComponent> {
    // Validate input
    const errors = validateComponentInput(input)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
    }

    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .insert({
        name: input.name,
        description: input.description || null,
        category: input.category || 'general',
        blocks_config: input.blocks_config,
        thumbnail_url: input.thumbnail_url || null,
        tags: input.tags || null,
        is_active: input.is_active !== undefined ? input.is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating component:', error)
      throw new Error(`Failed to create component: ${error.message}`)
    }

    return data as ReusableComponent
  },

  /**
   * Update component
   */
  async update(id: string, updates: Partial<ReusableComponentInput>): Promise<ReusableComponent> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Component not found: ${id}`)
    }

    // If updating blocks_config, validate it
    if (updates.blocks_config) {
      const validationInput: ReusableComponentInput = {
        name: updates.name || existing.name,
        blocks_config: updates.blocks_config
      }
      const errors = validateComponentInput(validationInput)
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
      }
    }

    const { data, error } = await supabaseAdmin
      .from('reusable_components')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating component ${id}:`, error)
      throw new Error(`Failed to update component: ${error.message}`)
    }

    // If blocks_config was updated, sync all instances
    if (updates.blocks_config) {
      await this.syncComponentInstances(id, updates.blocks_config)
    }

    return data as ReusableComponent
  },

  /**
   * Delete component (will cascade delete all instances)
   */
  async delete(id: string): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Component not found: ${id}`)
    }

    // Delete all instance blocks first
    const instances = await this.getInstancesByComponent(id)
    for (const instance of instances) {
      await this.deleteInstanceBlocks(instance.id)
    }

    const { error } = await supabaseAdmin
      .from('reusable_components')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting component ${id}:`, error)
      throw new Error(`Failed to delete component: ${error.message}`)
    }
  },

  /**
   * Toggle component active status
   */
  async toggleActive(id: string): Promise<ReusableComponent> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Component not found: ${id}`)
    }

    return this.update(id, { is_active: !existing.is_active })
  },

  /**
   * Duplicate component
   */
  async duplicate(id: string): Promise<ReusableComponent> {
    const original = await this.getById(id)
    if (!original) {
      throw new Error(`Component not found: ${id}`)
    }

    return this.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      category: original.category,
      blocks_config: original.blocks_config,
      thumbnail_url: original.thumbnail_url,
      tags: original.tags,
      is_active: false // Duplicates start as inactive
    })
  },

  // ============================================================================
  // COMPONENT INSTANCES MANAGEMENT
  // ============================================================================

  /**
   * Create component instance (inserts component into a page)
   */
  async createInstance(input: ComponentInstanceInput): Promise<ComponentInstance> {
    // Get the component
    const component = await this.getById(input.component_id)
    if (!component) {
      throw new Error(`Component not found: ${input.component_id}`)
    }

    // Create instance record
    const { data, error } = await supabaseAdmin
      .from('component_instances')
      .insert({
        component_id: input.component_id,
        page_id: input.page_id,
        display_order: input.display_order,
        overrides: input.overrides || {},
        instance_name: input.instance_name || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating component instance:', error)
      throw new Error(`Failed to create component instance: ${error.message}`)
    }

    const instance = data as ComponentInstance

    // Create actual content blocks from component's blocks_config
    await this.createInstanceBlocks(instance.id, component.blocks_config, input.page_id, input.display_order)

    return instance
  },

  /**
   * Get all instances of a component
   */
  async getInstancesByComponent(componentId: string): Promise<ComponentInstance[]> {
    const { data, error } = await supabaseAdmin
      .from('component_instances')
      .select('*')
      .eq('component_id', componentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error fetching instances for component ${componentId}:`, error)
      throw new Error(`Failed to fetch instances: ${error.message}`)
    }

    return (data as ComponentInstance[]) || []
  },

  /**
   * Get all instances on a page
   */
  async getInstancesByPage(pageId: string): Promise<ComponentInstance[]> {
    const { data, error } = await supabaseAdmin
      .from('component_instances')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error(`Error fetching instances for page ${pageId}:`, error)
      throw new Error(`Failed to fetch instances: ${error.message}`)
    }

    return (data as ComponentInstance[]) || []
  },

  /**
   * Delete component instance
   */
  async deleteInstance(instanceId: string): Promise<void> {
    // Delete instance blocks first
    await this.deleteInstanceBlocks(instanceId)

    // Delete instance record
    const { error } = await supabaseAdmin
      .from('component_instances')
      .delete()
      .eq('id', instanceId)

    if (error) {
      console.error(`Error deleting instance ${instanceId}:`, error)
      throw new Error(`Failed to delete instance: ${error.message}`)
    }
  },

  /**
   * Get component usage statistics
   */
  async getUsageStats(componentId: string): Promise<ComponentUsageStats[]> {
    const { data, error } = await supabaseAdmin
      .rpc('get_component_usage_summary', { component_uuid: componentId })

    if (error) {
      console.error(`Error fetching usage stats for component ${componentId}:`, error)
      throw new Error(`Failed to fetch usage stats: ${error.message}`)
    }

    return (data as ComponentUsageStats[]) || []
  },

  // ============================================================================
  // INTERNAL HELPER METHODS
  // ============================================================================

  /**
   * Create actual content blocks from component's blocks_config
   */
  async createInstanceBlocks(
    instanceId: string,
    blocksConfig: BlockConfiguration[],
    pageId: string,
    startingOrder: number
  ): Promise<void> {
    let currentOrder = startingOrder

    for (const blockConfig of blocksConfig) {
      const blockInput: ContentBlockInput = {
        page_id: pageId,
        block_type: blockConfig.block_type,
        content: blockConfig.content,
        content_ar: blockConfig.content_ar || null,
        display_order: currentOrder,
        is_visible: true,
        background_color: blockConfig.styling?.background_color || null,
        padding: blockConfig.styling?.padding || null,
        padding_horizontal: blockConfig.styling?.padding_horizontal || null,
        custom_css_class: blockConfig.styling?.custom_css_class || null,
        container_width: blockConfig.styling?.container_width || null,
        margin_top: blockConfig.styling?.margin_top || null,
        margin_bottom: blockConfig.styling?.margin_bottom || null,
        margin_horizontal: blockConfig.styling?.margin_horizontal || null
      }

      await blocksService.create(blockInput)
      currentOrder++
    }

    // Update instance's last_synced_at
    await supabaseAdmin
      .from('component_instances')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', instanceId)
  },

  /**
   * Delete all blocks associated with a component instance
   */
  async deleteInstanceBlocks(instanceId: string): Promise<void> {
    // Get instance details
    const { data: instance, error: instanceError } = await supabaseAdmin
      .from('component_instances')
      .select('page_id, display_order, component_id')
      .eq('id', instanceId)
      .single()

    if (instanceError || !instance) {
      return // Instance already deleted or doesn't exist
    }

    // Get component to know how many blocks to delete
    const component = await this.getById(instance.component_id)
    if (!component) return

    const blockCount = component.blocks_config.length

    // Delete blocks in the range [display_order, display_order + blockCount)
    const { error: deleteError } = await supabaseAdmin
      .from('content_blocks')
      .delete()
      .eq('page_id', instance.page_id)
      .gte('display_order', instance.display_order)
      .lt('display_order', instance.display_order + blockCount)

    if (deleteError) {
      console.error('Error deleting instance blocks:', deleteError)
    }
  },

  /**
   * Sync all instances of a component with new blocks_config
   * Called when component is updated (reference mode)
   */
  async syncComponentInstances(
    componentId: string,
    newBlocksConfig: BlockConfiguration[]
  ): Promise<void> {
    const instances = await this.getInstancesByComponent(componentId)

    for (const instance of instances) {
      // Delete old blocks
      await this.deleteInstanceBlocks(instance.id)

      // Create new blocks
      await this.createInstanceBlocks(
        instance.id,
        newBlocksConfig,
        instance.page_id,
        instance.display_order
      )
    }
  }
}
