/**
 * CMS Types - Page Content Management System
 *
 * TypeScript types for block-based page builder
 */

// ============================================================================
// PAGE TYPES
// ============================================================================

export type PageStatus = 'draft' | 'published' | 'archived'
export type TemplateType = 'standard' | 'landing' | 'gallery' | 'full_width'

export interface Page {
  id: string
  slug: string
  title: string
  meta_description: string | null
  navigation_id: string | null
  template_type: TemplateType
  status: PageStatus
  is_published: boolean
  is_reusable: boolean
  published_at: string | null
  title_ar: string | null
  meta_description_ar: string | null
  og_image: string | null
  keywords: string[] | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface PageInput {
  slug: string
  title: string
  meta_description?: string | null
  navigation_id?: string | null
  template_type?: TemplateType
  status?: PageStatus
  is_published?: boolean
  title_ar?: string | null
  meta_description_ar?: string | null
  og_image?: string | null
  keywords?: string[] | null
}

export interface PageWithBlocks extends Page {
  blocks: ContentBlock[]
}

// ============================================================================
// CONTENT BLOCK TYPES
// ============================================================================

export type BlockType =
  | 'text'
  | 'image'
  | 'image_gallery'
  | 'video'
  | 'cards'
  | 'cta'
  | 'page_embed'
  | 'section'      // Container: Groups blocks with shared styling
  | 'columns'      // Container: Multi-column layouts
  | 'hero'
  | 'stats_grid'
  | 'accordion'
  | 'table'
  | 'staff_grid'
  | 'news_feed'

export type PaddingSize = 'none' | 'small' | 'medium' | 'large'
export type ContainerWidth = 'narrow' | 'contained' | 'wide' | 'full'
export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type DisplayStyle = 'flat' | 'card' | 'featured'
export type CardBorderRadius = 'none' | 'small' | 'medium' | 'large'
export type CardShadow = 'none' | 'subtle' | 'medium' | 'strong'

export interface ContentBlock {
  id: string
  page_id: string
  parent_block_id: string | null  // For nested blocks (null = top-level)
  block_type: BlockType
  content: BlockContent
  content_ar: BlockContent | null
  display_order: number
  is_visible: boolean
  background_color: string | null
  padding: PaddingSize | null
  padding_horizontal?: PaddingSize | null
  custom_css_class: string | null
  // Layout settings
  container_width?: ContainerWidth | null
  margin_top?: SpacingSize | null
  margin_bottom?: SpacingSize | null
  margin_horizontal?: SpacingSize | null
  // Card display settings
  display_style?: DisplayStyle | null
  card_border_color?: string | null
  card_border_radius?: CardBorderRadius | null
  card_shadow?: CardShadow | null
  card_hover_effect?: boolean | null
  created_at: string
  updated_at: string
  // Nested blocks (populated when queried with children)
  blocks?: ContentBlock[]
}

export interface ContentBlockInput {
  page_id: string
  parent_block_id?: string | null  // For nested blocks
  block_type: BlockType
  content: BlockContent
  content_ar?: BlockContent | null
  display_order?: number
  is_visible?: boolean
  background_color?: string | null
  padding?: PaddingSize | null
  padding_horizontal?: PaddingSize | null
  custom_css_class?: string | null
  // Layout settings
  container_width?: ContainerWidth | null
  margin_top?: SpacingSize | null
  margin_bottom?: SpacingSize | null
  margin_horizontal?: SpacingSize | null
}

// ============================================================================
// BLOCK CONTENT TYPES (JSONB)
// ============================================================================

// Base block content interface
export interface BlockContent {
  [key: string]: any
}

// Text Block
export interface TextBlockContent extends BlockContent {
  html: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
  columns?: 1 | 2 | 3
}

// Image Block
export interface ImageBlockContent extends BlockContent {
  url: string
  alt: string
  caption?: string
  alignment?: 'left' | 'center' | 'right' | 'full'
  width?: number
  height?: number
  media_id?: string
}

// Image Gallery Block
export interface ImageGalleryBlockContent extends BlockContent {
  images: Array<{
    url: string
    alt: string
    caption?: string
    media_id?: string
  }>
  layout?: 'grid' | 'carousel' | 'masonry'
  columns?: 2 | 3 | 4
}

// Video Block
export interface VideoBlockContent extends BlockContent {
  url: string // YouTube/Vimeo URL or uploaded video URL
  videoType?: 'embed' | 'upload' // Embed (YouTube/Vimeo) or Upload (direct file)
  thumbnail?: string
  caption?: string
  autoplay?: boolean
}

// CTA Block
export interface CTABlockContent extends BlockContent {
  title: string
  description?: string
  buttons: Array<{
    text: string
    url: string
    style?: 'primary' | 'secondary' | 'outline'
  }>
  alignment?: 'left' | 'center' | 'right'
}

// Cards Block
export interface CardsBlockContent extends BlockContent {
  cards: Array<{
    title: string
    description: string
    image?: string
    button_text?: string
    button_url?: string
  }>
  columns?: 2 | 3 | 4
  card_style?: 'elevated' | 'outlined' | 'flat'
}

// Page Embed Block - Embed reusable page sections
export interface PageEmbedBlockContent extends BlockContent {
  page_id: string
  blocks_to_show: 'all' | string[]  // 'all' or array of specific block IDs
  show_title?: boolean  // Whether to show the embedded page's title
}

// Section Block - Container for grouping blocks with shared styling
export interface SectionBlockContent extends BlockContent {
  // Section blocks don't have their own content
  // They contain nested blocks (via parent_block_id relationship)
  // All styling comes from ContentBlock fields (background_color, padding, etc.)
}

// Columns Block - Multi-column layout container
export interface ColumnsBlockContent extends BlockContent {
  column_count: 2 | 3 | 4  // Number of columns
  column_ratio?: string  // e.g., '1:1', '2:1', '1:2:1', etc.
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'  // Gap between columns
  stack_on_mobile?: boolean  // Stack vertically on mobile (default: true)
  // Each column contains nested blocks (via parent_block_id relationship)
  // Columns are identified by display_order of child blocks
}

// Hero Block
export interface HeroBlockContent extends BlockContent {
  title: string
  subtitle?: string
  background_image?: string
  background_video?: string
  overlay_opacity?: number
  buttons?: Array<{
    text: string
    url: string
    style?: 'primary' | 'secondary' | 'outline'
  }>
  alignment?: 'left' | 'center' | 'right'
  height?: 'small' | 'medium' | 'large' | 'full'
}

// Stats Grid Block
export interface StatsGridBlockContent extends BlockContent {
  stats: Array<{
    number: string
    label: string
    icon?: string
  }>
  columns?: 2 | 3 | 4
}

// Accordion Block
export interface AccordionBlockContent extends BlockContent {
  items: Array<{
    question: string
    answer: string
    is_open?: boolean
  }>
  allow_multiple?: boolean
}

// Table Block
export interface TableBlockContent extends BlockContent {
  headers: string[]
  rows: string[][]
  striped?: boolean
  bordered?: boolean
}

// Staff Grid Block
export interface StaffGridBlockContent extends BlockContent {
  staff_ids?: string[] // Reference to faculty table
  custom_staff?: Array<{
    name: string
    position: string
    image?: string
    bio?: string
  }>
  columns?: 2 | 3 | 4
}

// News Feed Block
export interface NewsFeedBlockContent extends BlockContent {
  limit?: number
  category?: string
  layout?: 'grid' | 'list'
}

// ============================================================================
// MEDIA LIBRARY TYPES
// ============================================================================

export type MediaType = 'image' | 'video' | 'document' | 'audio'

export interface MediaItem {
  id: string
  filename: string
  original_filename: string
  url: string
  type: MediaType
  mime_type: string
  size_bytes: number
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  title: string | null
  folder: string
  tags: string[] | null
  usage_count: number
  last_used_at: string | null
  uploaded_at: string
  uploaded_by: string | null
}

export interface MediaItemInput {
  filename: string
  original_filename: string
  url: string
  type: MediaType
  mime_type: string
  size_bytes: number
  width?: number | null
  height?: number | null
  alt_text?: string | null
  caption?: string | null
  title?: string | null
  folder?: string
  tags?: string[] | null
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface CMSResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends CMSResponse<T[]> {
  total: number
  page: number
  limit: number
  pages: number
}

// ============================================================================
// VALIDATION & HELPERS
// ============================================================================

export interface ValidationError {
  field: string
  message: string
  code: string
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  text: 'Text Block',
  image: 'Image',
  image_gallery: 'Image Gallery',
  video: 'Video',
  cards: 'Cards',
  cta: 'Call to Action',
  page_embed: 'Page Embed',
  section: 'Section Container',
  columns: 'Columns Layout',
  hero: 'Hero Section',
  stats_grid: 'Statistics Grid',
  accordion: 'Accordion / FAQ',
  table: 'Table',
  staff_grid: 'Staff Grid',
  news_feed: 'News Feed'
}

export const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  text: '📝',
  image: '🖼️',
  image_gallery: '🎨',
  video: '🎥',
  cards: '🎴',
  cta: '🎯',
  page_embed: '🔗',
  section: '📦',
  columns: '📐',
  hero: '🌟',
  stats_grid: '📊',
  accordion: '📋',
  table: '📑',
  staff_grid: '👥',
  news_feed: '📰'
}

// Validation helpers
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9/\-]+$/.test(slug)
}

export function validatePageInput(input: PageInput): ValidationError[] {
  const errors: ValidationError[] = []

  if (!input.slug || input.slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: 'Slug is required',
      code: 'REQUIRED_FIELD'
    })
  } else if (!validateSlug(input.slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must contain only lowercase letters, numbers, hyphens, and slashes',
      code: 'INVALID_FORMAT'
    })
  }

  if (!input.title || input.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required',
      code: 'REQUIRED_FIELD'
    })
  }

  return errors
}

export function getDefaultBlockContent(blockType: BlockType): BlockContent {
  switch (blockType) {
    case 'text':
      return { html: '<p>Enter your text here...</p>', alignment: 'left' }
    case 'image':
      return { url: '', alt: '', alignment: 'center' }
    case 'image_gallery':
      return { images: [], layout: 'grid', columns: 3 }
    case 'video':
      return { url: '' }
    case 'cards':
      return { cards: [], columns: 3, card_style: 'elevated' }
    case 'cta':
      return { title: 'Call to Action', buttons: [], alignment: 'center' }
    case 'page_embed':
      return { page_id: '', blocks_to_show: 'all', show_title: true }
    case 'section':
      return {}  // Section blocks contain nested blocks
    case 'columns':
      return { column_count: 2, gap: 'md', stack_on_mobile: true }
    case 'hero':
      return { title: 'Hero Title', alignment: 'center', height: 'medium' }
    case 'stats_grid':
      return { stats: [], columns: 3 }
    case 'accordion':
      return { items: [], allow_multiple: false }
    case 'table':
      return { headers: [], rows: [], striped: true, bordered: true }
    case 'staff_grid':
      return { columns: 3 }
    case 'news_feed':
      return { limit: 6, layout: 'grid' }
    default:
      return {}
  }
}

// ============================================================================
// REUSABLE COMPONENTS TYPES
// ============================================================================

/**
 * Block Configuration for Reusable Components
 * Stores the complete definition of a block including its type, content, and styling
 */
export interface BlockConfiguration {
  block_type: BlockType
  content: BlockContent
  content_ar?: BlockContent | null
  styling?: {
    background_color?: string | null
    padding?: PaddingSize | null
    padding_horizontal?: PaddingSize | null
    custom_css_class?: string | null
    container_width?: ContainerWidth | null
    margin_top?: SpacingSize | null
    margin_bottom?: SpacingSize | null
    margin_horizontal?: SpacingSize | null
    display_style?: DisplayStyle | null
    card_border_color?: string | null
    card_border_radius?: CardBorderRadius | null
    card_shadow?: CardShadow | null
    card_hover_effect?: boolean | null
  }
}

/**
 * Reusable Component
 * A template containing one or more blocks that can be inserted into pages
 */
export interface ReusableComponent {
  id: string
  name: string
  description: string | null
  category: string
  blocks_config: BlockConfiguration[]
  thumbnail_url: string | null
  tags: string[] | null
  usage_count: number
  last_used_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

/**
 * Input for creating/updating reusable components
 */
export interface ReusableComponentInput {
  name: string
  description?: string | null
  category?: string
  blocks_config: BlockConfiguration[]
  thumbnail_url?: string | null
  tags?: string[] | null
  is_active?: boolean
}

/**
 * Component Instance
 * Tracks where a component is used and allows per-instance overrides
 */
export interface ComponentInstance {
  id: string
  component_id: string
  page_id: string
  display_order: number
  overrides: Record<string, any>
  instance_name: string | null
  created_at: string
  last_synced_at: string | null
}

/**
 * Input for creating component instances
 */
export interface ComponentInstanceInput {
  component_id: string
  page_id: string
  display_order: number
  overrides?: Record<string, any>
  instance_name?: string | null
}

/**
 * Component with instance information
 */
export interface ComponentWithInstances extends ReusableComponent {
  instances: ComponentInstance[]
}

/**
 * Component usage statistics
 */
export interface ComponentUsageStats {
  page_id: string
  page_title: string
  page_slug: string
  instance_count: number
  last_used: string
}

/**
 * Component categories
 */
export type ComponentCategory =
  | 'general'
  | 'hero'
  | 'cta'
  | 'stats'
  | 'header'
  | 'footer'
  | 'content'
  | 'testimonial'
  | 'form'

export const COMPONENT_CATEGORIES: Record<ComponentCategory, string> = {
  general: 'General',
  hero: 'Hero Sections',
  cta: 'Call to Actions',
  stats: 'Statistics',
  header: 'Headers',
  footer: 'Footers',
  content: 'Content Blocks',
  testimonial: 'Testimonials',
  form: 'Forms'
}

export const COMPONENT_CATEGORY_COLORS: Record<ComponentCategory, string> = {
  general: 'bg-gray-100 text-gray-800',
  hero: 'bg-purple-100 text-purple-800',
  cta: 'bg-green-100 text-green-800',
  stats: 'bg-blue-100 text-blue-800',
  header: 'bg-indigo-100 text-indigo-800',
  footer: 'bg-slate-100 text-slate-800',
  content: 'bg-amber-100 text-amber-800',
  testimonial: 'bg-pink-100 text-pink-800',
  form: 'bg-cyan-100 text-cyan-800'
}

/**
 * Validation helpers for components
 */
export function validateComponentInput(input: ReusableComponentInput): ValidationError[] {
  const errors: ValidationError[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Component name is required',
      code: 'REQUIRED_FIELD'
    })
  }

  if (input.name && input.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Component name must be less than 100 characters',
      code: 'FIELD_TOO_LONG'
    })
  }

  if (!input.blocks_config || input.blocks_config.length === 0) {
    errors.push({
      field: 'blocks_config',
      message: 'Component must have at least one block',
      code: 'REQUIRED_FIELD'
    })
  }

  // Validate each block configuration
  if (input.blocks_config && input.blocks_config.length > 0) {
    input.blocks_config.forEach((block, index) => {
      if (!block.block_type) {
        errors.push({
          field: `blocks_config[${index}].block_type`,
          message: `Block ${index + 1} is missing block_type`,
          code: 'REQUIRED_FIELD'
        })
      }
      if (!block.content) {
        errors.push({
          field: `blocks_config[${index}].content`,
          message: `Block ${index + 1} is missing content`,
          code: 'REQUIRED_FIELD'
        })
      }
    })
  }

  return errors
}
