/**
 * Pages Service - Supabase Integration
 *
 * Provides CRUD operations for CMS pages and content blocks
 */

import { supabase, supabaseAdmin } from '@/lib/supabase'
import {
  Page,
  PageInput,
  PageWithBlocks,
  ContentBlock,
  ContentBlockInput,
  validatePageInput
} from '@/types/cms'

export const pagesService = {
  /**
   * Get all pages (admin access)
   */
  async getAll(includeBlocks = false): Promise<Page[] | PageWithBlocks[]> {
    const selectQuery = includeBlocks
      ? `*,
         content_blocks (
           id, page_id, parent_block_id, block_type, content, content_ar,
           display_order, is_visible, background_color, padding, padding_horizontal, custom_css_class,
           container_width, margin_top, margin_bottom, margin_horizontal,
           display_style, card_border_color, card_border_radius, card_shadow, card_hover_effect,
           column_index, created_at, updated_at
         )`
      : '*'

    const { data, error } = await supabaseAdmin
      .from('pages')
      .select(selectQuery)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pages:', error)
      throw new Error(`Failed to fetch pages: ${error.message}`)
    }

    if (!data) return []

    if (includeBlocks) {
      return data.map((page: any) => ({
        ...(page as Page),
        blocks: (page.content_blocks || []).sort((a: any, b: any) => a.display_order - b.display_order)
      })) as PageWithBlocks[]
    }

    return data as unknown as Page[]
  },

  /**
   * Get published pages only (public access)
   */
  async getPublished(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('is_published', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching published pages:', error)
      throw new Error(`Failed to fetch published pages: ${error.message}`)
    }

    return (data as unknown as Page[]) || []
  },

  /**
   * Get reusable pages (for embedding in other pages)
   */
  async getReusable(includeBlocks = false): Promise<Page[] | PageWithBlocks[]> {
    const selectQuery = includeBlocks
      ? `*,
         content_blocks (
           id, page_id, parent_block_id, block_type, content, content_ar,
           display_order, is_visible, background_color, padding, padding_horizontal, custom_css_class,
           container_width, margin_top, margin_bottom, margin_horizontal,
           display_style, card_border_color, card_border_radius, card_shadow, card_hover_effect,
           column_index, created_at, updated_at
         )`
      : '*'

    const { data, error } = await supabaseAdmin
      .from('pages')
      .select(selectQuery)
      .eq('is_reusable', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching reusable pages:', error)
      throw new Error(`Failed to fetch reusable pages: ${error.message}`)
    }

    if (!data) return []

    if (includeBlocks) {
      return data.map((page: any) => ({
        ...(page as Page),
        blocks: (page.content_blocks || []).sort((a: any, b: any) => a.display_order - b.display_order)
      })) as PageWithBlocks[]
    }

    return data as unknown as Page[]
  },

  /**
   * Get page by ID
   */
  async getById(id: string, includeBlocks = false): Promise<Page | PageWithBlocks | null> {
    const selectQuery = includeBlocks
      ? `*,
         content_blocks (
           id, page_id, parent_block_id, block_type, content, content_ar,
           display_order, is_visible, background_color, padding, padding_horizontal, custom_css_class,
           container_width, margin_top, margin_bottom, margin_horizontal,
           display_style, card_border_color, card_border_radius, card_shadow, card_hover_effect,
           column_index, created_at, updated_at
         )`
      : '*'

    const { data, error} = await supabaseAdmin
      .from('pages')
      .select(selectQuery)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error(`Error fetching page ${id}:`, error)
      throw new Error(`Failed to fetch page: ${error.message}`)
    }

    if (!data) return null

    if (includeBlocks) {
      const pageData = data as any
      const allBlocks = (pageData.content_blocks || []) as ContentBlock[]

      // Build nested structure for containers
      const topLevelBlocks = allBlocks.filter(b => !b.parent_block_id)
      const nestedBlocks = allBlocks.filter(b => b.parent_block_id)

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
        ...(pageData as Page),
        blocks: blocksWithChildren
      } as PageWithBlocks
    }

    return data as unknown as Page
  },

  /**
   * Get page by slug (for frontend rendering)
   */
  async getBySlug(slug: string, publishedOnly = true): Promise<PageWithBlocks | null> {
    // Use admin client for preview mode to bypass RLS
    const client = publishedOnly ? supabase : supabaseAdmin

    let query = client
      .from('pages')
      .select(`
        *,
        content_blocks (
          id,
          page_id,
          parent_block_id,
          block_type,
          content,
          content_ar,
          display_order,
          is_visible,
          background_color,
          padding,
          padding_horizontal,
          custom_css_class,
          container_width,
          margin_top,
          margin_bottom,
          margin_horizontal,
          display_style,
          card_border_color,
          card_border_radius,
          card_shadow,
          card_hover_effect,
          column_index,
          created_at,
          updated_at
        )
      `)
      .eq('slug', slug)

    if (publishedOnly) {
      query = query.eq('is_published', true).eq('status', 'published')
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error(`Error fetching page by slug ${slug}:`, error)
      throw new Error(`Failed to fetch page: ${error.message}`)
    }

    if (!data) return null

    // Transform and build nested block structure
    const pageData = data as any
    const allBlocks = (pageData.content_blocks || []) as ContentBlock[]

    // Separate top-level and nested blocks
    const topLevelBlocks = allBlocks.filter(b => !b.parent_block_id)
    const nestedBlocks = allBlocks.filter(b => b.parent_block_id)

    // Attach nested blocks to their parent containers
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

    // Sort top-level blocks by display_order
    blocksWithChildren.sort((a, b) => a.display_order - b.display_order)

    return {
      ...(pageData as Page),
      blocks: blocksWithChildren
    } as PageWithBlocks
  },

  /**
   * Create new page
   */
  async create(input: PageInput): Promise<Page> {
    // Validate input
    const errors = validatePageInput(input)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
    }

    // Check for duplicate slug
    const existing = await this.getBySlug(input.slug, false)
    if (existing) {
      throw new Error(`Page with slug "${input.slug}" already exists`)
    }

    const { data, error } = await supabaseAdmin
      .from('pages')
      .insert(input)
      .select()
      .single()

    if (error) {
      console.error('Error creating page:', error)
      throw new Error(`Failed to create page: ${error.message}`)
    }

    return data
  },

  /**
   * Update page
   */
  async update(id: string, updates: Partial<PageInput>): Promise<Page> {
    // Get existing page
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Page not found: ${id}`)
    }

    // If updating slug, check for duplicates
    if (updates.slug && updates.slug !== existing.slug) {
      const duplicate = await this.getBySlug(updates.slug, false)
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Page with slug "${updates.slug}" already exists`)
      }
    }

    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating page ${id}:`, error)
      throw new Error(`Failed to update page: ${error.message}`)
    }

    return data
  },

  /**
   * Delete page (and all its blocks via CASCADE)
   */
  async delete(id: string): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Page not found: ${id}`)
    }

    const { error } = await supabaseAdmin
      .from('pages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting page ${id}:`, error)
      throw new Error(`Failed to delete page: ${error.message}`)
    }
  },

  /**
   * Publish/unpublish page
   */
  async togglePublish(id: string): Promise<Page> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Page not found: ${id}`)
    }

    return this.update(id, {
      is_published: !existing.is_published,
      status: !existing.is_published ? 'published' : 'draft'
    })
  },

  /**
   * Duplicate page
   */
  async duplicate(id: string): Promise<Page> {
    const original = await this.getById(id, true) as PageWithBlocks
    if (!original) {
      throw new Error(`Page not found: ${id}`)
    }

    // Create new page with "(Copy)" suffix
    const newSlug = `${original.slug}-copy`
    const newPage = await this.create({
      ...original,
      slug: newSlug,
      title: `${original.title} (Copy)`,
      is_published: false,
      status: 'draft'
    })

    // Copy all blocks
    if (original.blocks && original.blocks.length > 0) {
      for (const block of original.blocks) {
        await blocksService.create({
          page_id: newPage.id,
          block_type: block.block_type,
          content: block.content,
          content_ar: block.content_ar,
          display_order: block.display_order,
          is_visible: block.is_visible,
          background_color: block.background_color,
          padding: block.padding,
          custom_css_class: block.custom_css_class
        })
      }
    }

    return newPage
  }
}

// ============================================================================
// CONTENT BLOCKS SERVICE
// ============================================================================

export const blocksService = {
  /**
   * Get all blocks for a page
   */
  async getByPageId(pageId: string): Promise<ContentBlock[]> {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('page_id', pageId)
      .eq('is_visible', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error(`Error fetching blocks for page ${pageId}:`, error)
      throw new Error(`Failed to fetch blocks: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get all blocks for a page (admin - includes hidden)
   */
  async getByPageIdAdmin(pageId: string): Promise<ContentBlock[]> {
    const { data, error } = await supabaseAdmin
      .from('content_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error(`Error fetching blocks for page ${pageId}:`, error)
      throw new Error(`Failed to fetch blocks: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get block by ID
   */
  async getById(id: string): Promise<ContentBlock | null> {
    const { data, error } = await supabaseAdmin
      .from('content_blocks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error(`Error fetching block ${id}:`, error)
      throw new Error(`Failed to fetch block: ${error.message}`)
    }

    return data
  },

  /**
   * Create new block
   */
  async create(input: ContentBlockInput): Promise<ContentBlock> {
    const { data, error } = await supabaseAdmin
      .from('content_blocks')
      .insert(input)
      .select()
      .single()

    if (error) {
      console.error('Error creating block:', error)
      throw new Error(`Failed to create block: ${error.message}`)
    }

    return data
  },

  /**
   * Update block
   */
  async update(id: string, updates: Partial<ContentBlockInput>): Promise<ContentBlock> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Block not found: ${id}`)
    }

    const { data, error } = await supabaseAdmin
      .from('content_blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating block ${id}:`, error)
      throw new Error(`Failed to update block: ${error.message}`)
    }

    return data
  },

  /**
   * Delete block
   */
  async delete(id: string): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Block not found: ${id}`)
    }

    const { error } = await supabaseAdmin
      .from('content_blocks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting block ${id}:`, error)
      throw new Error(`Failed to delete block: ${error.message}`)
    }
  },

  /**
   * Reorder blocks
   */
  async reorder(blockIds: string[], newOrders: number[]): Promise<void> {
    if (blockIds.length !== newOrders.length) {
      throw new Error('Block IDs and new orders must have the same length')
    }

    for (let i = 0; i < blockIds.length; i++) {
      await this.update(blockIds[i], { display_order: newOrders[i] })
    }
  },

  /**
   * Toggle block visibility
   */
  async toggleVisibility(id: string): Promise<ContentBlock> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Block not found: ${id}`)
    }

    return this.update(id, { is_visible: !existing.is_visible })
  },

  /**
   * Duplicate block
   */
  async duplicate(id: string): Promise<ContentBlock> {
    const original = await this.getById(id)
    if (!original) {
      throw new Error(`Block not found: ${id}`)
    }

    // Get max display_order for this page
    const blocks = await this.getByPageIdAdmin(original.page_id)
    const maxOrder = Math.max(...blocks.map(b => b.display_order), -1)

    return this.create({
      page_id: original.page_id,
      block_type: original.block_type,
      content: original.content,
      content_ar: original.content_ar,
      display_order: maxOrder + 1,
      is_visible: original.is_visible,
      background_color: original.background_color,
      padding: original.padding,
      custom_css_class: original.custom_css_class
    })
  }
}
