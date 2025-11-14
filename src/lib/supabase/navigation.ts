/**
 * Navigation Service - Supabase Integration
 *
 * Provides CRUD operations and queries for the dynamic navigation system.
 * Handles hierarchical menu structure with bilingual support.
 */

import { supabase, supabaseAdmin } from '@/lib/supabase'
import {
  NavigationItem,
  NavigationItemInput,
  NavigationTreeNode,
  NavigationQueryFilters,
  validateNavigationItem,
  buildNavigationTree
} from '@/types/navigation'

export const navigationService = {
  /**
   * Get all navigation items (admin access)
   */
  async getAll(): Promise<NavigationItem[]> {
    const { data, error } = await supabaseAdmin
      .from('navigation_items')
      .select('*')
      .order('level', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching all navigation items:', error)
      throw new Error(`Failed to fetch navigation items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get only visible navigation items (public access)
   */
  async getVisible(): Promise<NavigationItem[]> {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_visible', true)
      .order('level', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching visible navigation items:', error)
      throw new Error(`Failed to fetch navigation items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get navigation items as hierarchical tree structure
   * Only returns visible items for public consumption
   */
  async getNavigationTree(): Promise<NavigationTreeNode[]> {
    const items = await this.getVisible()
    return buildNavigationTree(items)
  },

  /**
   * Get navigation items as hierarchical tree structure (ADMIN)
   * Returns ALL items including hidden ones for admin management
   */
  async getAdminNavigationTree(): Promise<NavigationTreeNode[]> {
    const items = await this.getAll()
    // Build tree without filtering by visibility
    const topLevel = items
      .filter(item => item.level === 1)
      .sort((a, b) => a.display_order - b.display_order)

    return topLevel.map(parent => ({
      id: parent.id,
      label_en: parent.label_en,
      label_ar: parent.label_ar,
      href: parent.href,
      icon: parent.icon,
      is_visible: parent.is_visible,
      is_featured: parent.is_featured,
      display_order: parent.display_order,
      description_en: parent.description_en,
      description_ar: parent.description_ar,
      children: items
        .filter(item => item.parent_id === parent.id)
        .sort((a, b) => a.display_order - b.display_order)
        .map(child => ({
          id: child.id,
          label_en: child.label_en,
          label_ar: child.label_ar,
          href: child.href,
          icon: child.icon,
          is_visible: child.is_visible,
          is_featured: child.is_featured,
          display_order: child.display_order,
          description_en: child.description_en,
          description_ar: child.description_ar,
          children: []
        }))
    }))
  },

  /**
   * Get navigation items by level
   */
  async getByLevel(level: 1 | 2, visibleOnly = true): Promise<NavigationItem[]> {
    let query = supabase
      .from('navigation_items')
      .select('*')
      .eq('level', level)

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    query = query.order('display_order', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching level ${level} navigation items:`, error)
      throw new Error(`Failed to fetch navigation items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get children of a specific parent item
   */
  async getChildren(parentId: string, visibleOnly = true): Promise<NavigationItem[]> {
    let query = supabase
      .from('navigation_items')
      .select('*')
      .eq('parent_id', parentId)

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    query = query.order('display_order', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching children for parent ${parentId}:`, error)
      throw new Error(`Failed to fetch child navigation items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get single navigation item by ID
   */
  async getById(id: string): Promise<NavigationItem | null> {
    const { data, error } = await supabaseAdmin
      .from('navigation_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error(`Error fetching navigation item ${id}:`, error)
      throw new Error(`Failed to fetch navigation item: ${error.message}`)
    }

    return data
  },

  /**
   * Get navigation item by href path
   */
  async getByHref(href: string): Promise<NavigationItem | null> {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('href', href)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error(`Error fetching navigation item by href ${href}:`, error)
      throw new Error(`Failed to fetch navigation item: ${error.message}`)
    }

    return data
  },

  /**
   * Create new navigation item
   */
  async create(item: NavigationItemInput): Promise<NavigationItem> {
    // Validate input
    const errors = validateNavigationItem(item)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
    }

    // If level 2, verify parent exists
    if (item.level === 2 && item.parent_id) {
      const parent = await this.getById(item.parent_id)
      if (!parent) {
        throw new Error(`Parent navigation item not found: ${item.parent_id}`)
      }
      if (parent.level !== 1) {
        throw new Error('Parent must be a top-level (level 1) item')
      }
    }

    // Check for duplicate href
    const existing = await this.getByHref(item.href)
    if (existing) {
      throw new Error(`Navigation item with href "${item.href}" already exists`)
    }

    const { data, error } = await supabaseAdmin
      .from('navigation_items')
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error('Error creating navigation item:', error)
      throw new Error(`Failed to create navigation item: ${error.message}`)
    }

    return data
  },

  /**
   * Update existing navigation item
   */
  async update(id: string, updates: Partial<NavigationItemInput>): Promise<NavigationItem> {
    // Get existing item
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Navigation item not found: ${id}`)
    }

    // Merge updates with existing data for validation
    const merged = { ...existing, ...updates }
    const errors = validateNavigationItem(merged as NavigationItemInput)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
    }

    // If updating parent_id, verify parent exists
    if (updates.parent_id !== undefined && updates.parent_id !== null) {
      const parent = await this.getById(updates.parent_id)
      if (!parent) {
        throw new Error(`Parent navigation item not found: ${updates.parent_id}`)
      }
      if (parent.level !== 1) {
        throw new Error('Parent must be a top-level (level 1) item')
      }
    }

    // If updating href, check for duplicates
    if (updates.href && updates.href !== existing.href) {
      const duplicate = await this.getByHref(updates.href)
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Navigation item with href "${updates.href}" already exists`)
      }
    }

    const { data, error } = await supabaseAdmin
      .from('navigation_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating navigation item ${id}:`, error)
      throw new Error(`Failed to update navigation item: ${error.message}`)
    }

    return data
  },

  /**
   * Delete navigation item (and its children via CASCADE)
   */
  async delete(id: string): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Navigation item not found: ${id}`)
    }

    // Warn if deleting top-level item with children
    if (existing.level === 1) {
      const children = await this.getChildren(id, false)
      if (children.length > 0) {
        console.warn(`Deleting top-level navigation item "${existing.label_en}" with ${children.length} children`)
      }
    }

    const { error } = await supabaseAdmin
      .from('navigation_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting navigation item ${id}:`, error)
      throw new Error(`Failed to delete navigation item: ${error.message}`)
    }
  },

  /**
   * Toggle visibility of a navigation item
   */
  async toggleVisibility(id: string): Promise<NavigationItem> {
    const item = await this.getById(id)
    if (!item) {
      throw new Error(`Navigation item not found: ${id}`)
    }

    return this.update(id, { is_visible: !item.is_visible })
  },

  /**
   * Reorder navigation items within same level/parent
   */
  async reorder(itemIds: string[], newOrders: number[]): Promise<void> {
    if (itemIds.length !== newOrders.length) {
      throw new Error('itemIds and newOrders arrays must have same length')
    }

    // Update each item's display_order
    const updates = itemIds.map((id, index) =>
      supabaseAdmin
        .from('navigation_items')
        .update({ display_order: newOrders[index] })
        .eq('id', id)
    )

    try {
      await Promise.all(updates)
    } catch (error) {
      console.error('Error reordering navigation items:', error)
      throw new Error('Failed to reorder navigation items')
    }
  },

  /**
   * Get featured navigation items
   */
  async getFeatured(): Promise<NavigationItem[]> {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_featured', true)
      .eq('is_visible', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching featured navigation items:', error)
      throw new Error(`Failed to fetch featured items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Advanced filtering with multiple criteria
   */
  async getFiltered(filters: NavigationQueryFilters): Promise<NavigationItem[]> {
    let query = supabase.from('navigation_items').select('*')

    // Apply filters
    if (filters.is_visible !== undefined) {
      query = query.eq('is_visible', filters.is_visible)
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    if (filters.level !== undefined) {
      query = query.eq('level', filters.level)
    }

    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', filters.parent_id)
      }
    }

    // Apply ordering
    const orderBy = filters.orderBy || 'display_order'
    const orderDirection = filters.orderDirection || 'asc'
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching filtered navigation items:', error)
      throw new Error(`Failed to fetch navigation items: ${error.message}`)
    }

    return data || []
  },

  /**
   * Bulk update multiple items
   */
  async bulkUpdate(
    itemIds: string[],
    updates: Partial<NavigationItemInput>
  ): Promise<void> {
    const updatePromises = itemIds.map(id => this.update(id, updates))

    try {
      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Error in bulk update:', error)
      throw new Error('Failed to bulk update navigation items')
    }
  },

  /**
   * Search navigation items by label (English or Arabic)
   */
  async search(query: string): Promise<NavigationItem[]> {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .or(`label_en.ilike.%${query}%,label_ar.ilike.%${query}%`)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error searching navigation items:', error)
      throw new Error(`Failed to search navigation items: ${error.message}`)
    }

    return data || []
  }
}
