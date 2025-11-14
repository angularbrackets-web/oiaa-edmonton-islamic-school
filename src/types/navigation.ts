/**
 * Navigation System Types
 *
 * Defines TypeScript types for the dynamic navigation CMS system.
 * Supports bilingual (EN/AR), hierarchical menu structure with
 * visibility controls and SEO metadata.
 */

/**
 * Base navigation item from database
 */
export interface NavigationItem {
  id: string

  // Basic Information
  label_en: string
  label_ar: string | null
  href: string
  icon: string | null

  // Hierarchy
  level: 1 | 2  // 1 = top-level, 2 = sub-menu
  parent_id: string | null
  display_order: number

  // Visibility Controls
  is_visible: boolean
  is_featured: boolean

  // Optional Descriptions (for mega-menu)
  description_en: string | null
  description_ar: string | null

  // SEO Metadata
  page_title_en: string | null
  page_title_ar: string | null
  meta_description_en: string | null
  meta_description_ar: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

/**
 * Navigation item for insertion/update (without auto-generated fields)
 */
export interface NavigationItemInput {
  label_en: string
  label_ar?: string | null
  href: string
  icon?: string | null
  level: 1 | 2
  parent_id?: string | null
  display_order?: number
  is_visible?: boolean
  is_featured?: boolean
  description_en?: string | null
  description_ar?: string | null
  page_title_en?: string | null
  page_title_ar?: string | null
  meta_description_en?: string | null
  meta_description_ar?: string | null
}

/**
 * Navigation item with nested children (for frontend rendering)
 */
export interface NavigationItemWithChildren extends Omit<NavigationItem, 'parent_id' | 'level'> {
  children?: NavigationItem[]
}

/**
 * API Response wrapper
 */
export interface NavigationResponse<T = NavigationItem | NavigationItem[]> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Validation error details
 */
export interface NavigationValidationError {
  field: string
  message: string
  code: string
}

/**
 * Filter options for querying navigation items
 */
export interface NavigationQueryFilters {
  is_visible?: boolean
  is_featured?: boolean
  level?: 1 | 2
  parent_id?: string | null
  orderBy?: 'display_order' | 'label_en' | 'created_at'
  orderDirection?: 'asc' | 'desc'
}

/**
 * Bulk update operation
 */
export interface NavigationBulkUpdate {
  ids: string[]
  updates: Partial<NavigationItemInput>
}

/**
 * Navigation tree node (for hierarchical display)
 */
export interface NavigationTreeNode {
  id: string
  label_en: string
  label_ar: string | null
  href: string
  icon: string | null
  is_visible: boolean
  is_featured: boolean
  display_order: number
  description_en?: string | null
  description_ar?: string | null
  children: NavigationTreeNode[]
}

// Helper type guards
export const isTopLevelItem = (item: NavigationItem): boolean => {
  return item.level === 1 && item.parent_id === null
}

export const isSubMenuItem = (item: NavigationItem): boolean => {
  return item.level === 2 && item.parent_id !== null
}

// Validation helpers
export const validateHref = (href: string): boolean => {
  return /^(\/|https?:\/\/)/.test(href)
}

export const validateNavigationItem = (
  item: NavigationItemInput
): NavigationValidationError[] => {
  const errors: NavigationValidationError[] = []

  // Required fields
  if (!item.label_en || item.label_en.trim().length === 0) {
    errors.push({
      field: 'label_en',
      message: 'English label is required',
      code: 'REQUIRED_FIELD'
    })
  }

  if (!item.href || item.href.trim().length === 0) {
    errors.push({
      field: 'href',
      message: 'URL path is required',
      code: 'REQUIRED_FIELD'
    })
  } else if (!validateHref(item.href)) {
    errors.push({
      field: 'href',
      message: 'URL must start with / or http:// or https://',
      code: 'INVALID_FORMAT'
    })
  }

  // Level validation
  if (![1, 2].includes(item.level)) {
    errors.push({
      field: 'level',
      message: 'Level must be 1 (top-level) or 2 (sub-menu)',
      code: 'INVALID_VALUE'
    })
  }

  // Parent ID validation
  if (item.level === 1 && item.parent_id) {
    errors.push({
      field: 'parent_id',
      message: 'Top-level items cannot have a parent',
      code: 'INVALID_HIERARCHY'
    })
  }

  if (item.level === 2 && !item.parent_id) {
    errors.push({
      field: 'parent_id',
      message: 'Sub-menu items must have a parent',
      code: 'REQUIRED_FIELD'
    })
  }

  return errors
}

// Transform database rows to tree structure
export const buildNavigationTree = (
  items: NavigationItem[]
): NavigationTreeNode[] => {
  const topLevel = items
    .filter(item => item.level === 1 && item.is_visible)
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
      .filter(item => item.parent_id === parent.id && item.is_visible)
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
}
