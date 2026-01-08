#!/usr/bin/env tsx

/**
 * Data Migration: Move component blocks from JSON to database
 *
 * This script migrates existing component blocks_config (JSON array) to
 * content_blocks table rows, enabling unified block system.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface BlockConfiguration {
  block_type: string
  content: any
  content_ar?: any
  styling?: {
    background_color?: string
    padding?: string
    padding_horizontal?: string
    custom_css_class?: string
    container_width?: string
    margin_top?: string
    margin_bottom?: string
    margin_horizontal?: string
    display_style?: string
    card_border_color?: string
    card_border_radius?: string
    card_shadow?: string
    card_hover_effect?: boolean
  }
}

interface ReusableComponent {
  id: string
  name: string
  blocks_config: BlockConfiguration[]
}

async function migrateComponentBlocks() {
  console.log('🚀 Starting component blocks data migration\n')

  try {
    // Step 1: Fetch all components with blocks_config
    console.log('📋 Fetching components with blocks...')
    const { data: components, error: fetchError } = await supabase
      .from('reusable_components')
      .select('id, name, blocks_config')
      .not('blocks_config', 'is', null)

    if (fetchError) {
      throw new Error(`Failed to fetch components: ${fetchError.message}`)
    }

    if (!components || components.length === 0) {
      console.log('✅ No components with blocks_config found. Migration not needed.')
      return
    }

    console.log(`   Found ${components.length} component(s) with blocks\n`)

    // Step 2: For each component, migrate blocks to database
    let totalBlocksMigrated = 0
    let componentsUpdated = 0

    for (const component of components as ReusableComponent[]) {
      console.log(`📦 Processing component: "${component.name}" (${component.id})`)

      const blocksConfig = component.blocks_config
      if (!Array.isArray(blocksConfig) || blocksConfig.length === 0) {
        console.log('   ⚠️  No blocks in blocks_config, skipping...\n')
        continue
      }

      console.log(`   Found ${blocksConfig.length} block(s) to migrate`)

      // Step 3: Create content_blocks rows for each block
      const blocksToInsert = blocksConfig.map((block, index) => ({
        component_id: component.id,
        page_id: null,
        block_type: block.block_type,
        content: block.content || {},
        content_ar: block.content_ar || null,
        display_order: index,
        is_visible: true,
        // Extract styling fields
        background_color: block.styling?.background_color || null,
        padding: block.styling?.padding || null,
        padding_horizontal: block.styling?.padding_horizontal || null,
        custom_css_class: block.styling?.custom_css_class || null,
        container_width: block.styling?.container_width || null,
        margin_top: block.styling?.margin_top || null,
        margin_bottom: block.styling?.margin_bottom || null,
        margin_horizontal: block.styling?.margin_horizontal || null,
        display_style: block.styling?.display_style || null,
        card_border_color: block.styling?.card_border_color || null,
        card_border_radius: block.styling?.card_border_radius || null,
        card_shadow: block.styling?.card_shadow || null,
        card_hover_effect: block.styling?.card_hover_effect || null,
        parent_block_id: null,
        column_index: null
      }))

      // Insert blocks into database
      const { data: insertedBlocks, error: insertError } = await supabase
        .from('content_blocks')
        .insert(blocksToInsert)
        .select()

      if (insertError) {
        console.error(`   ❌ Failed to insert blocks: ${insertError.message}`)
        throw insertError
      }

      console.log(`   ✅ Migrated ${insertedBlocks?.length || 0} block(s)`)
      totalBlocksMigrated += insertedBlocks?.length || 0

      // Step 4: Clear the blocks_config field (set to empty array)
      const { error: updateError } = await supabase
        .from('reusable_components')
        .update({ blocks_config: [] })
        .eq('id', component.id)

      if (updateError) {
        console.error(`   ⚠️  Warning: Could not clear blocks_config: ${updateError.message}`)
      } else {
        console.log(`   ✅ Cleared blocks_config field\n`)
        componentsUpdated++
      }
    }

    // Summary
    console.log('=' .repeat(60))
    console.log('🎉 Migration completed successfully!\n')
    console.log(`📊 Summary:`)
    console.log(`   - Components processed: ${components.length}`)
    console.log(`   - Components updated: ${componentsUpdated}`)
    console.log(`   - Total blocks migrated: ${totalBlocksMigrated}`)
    console.log('=' .repeat(60))

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateComponentBlocks()
