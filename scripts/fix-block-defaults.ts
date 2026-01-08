#!/usr/bin/env tsx

/**
 * Fix Block Styling Defaults
 *
 * Updates all existing blocks to have clean defaults (no borders/shadows)
 * unless explicitly set by the user.
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

async function fixBlockDefaults() {
  console.log('🔧 Fixing block styling defaults...\n')

  try {
    // Get all blocks
    const { data: blocks, error: fetchError } = await supabase
      .from('content_blocks')
      .select('id, block_type, display_style, card_border_radius, card_shadow, card_hover_effect')

    if (fetchError) {
      throw new Error(`Failed to fetch blocks: ${fetchError.message}`)
    }

    if (!blocks || blocks.length === 0) {
      console.log('✅ No blocks found. Nothing to fix.')
      return
    }

    console.log(`📊 Found ${blocks.length} blocks to check\n`)

    let updatedCount = 0

    for (const block of blocks) {
      const updates: any = {}
      let needsUpdate = false

      // Fix display_style if it's null or undefined (should be 'flat')
      if (!block.display_style) {
        updates.display_style = 'flat'
        needsUpdate = true
      }

      // Fix card_border_radius if it's null or undefined (should be 'none')
      if (!block.card_border_radius) {
        updates.card_border_radius = 'none'
        needsUpdate = true
      }

      // Fix card_shadow if it's null or undefined (should be 'none')
      if (!block.card_shadow) {
        updates.card_shadow = 'none'
        needsUpdate = true
      }

      // Fix card_hover_effect if it's null or undefined (should be false)
      if (block.card_hover_effect === null || block.card_hover_effect === undefined) {
        updates.card_hover_effect = false
        needsUpdate = true
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('content_blocks')
          .update(updates)
          .eq('id', block.id)

        if (updateError) {
          console.error(`❌ Error updating block ${block.id}:`, updateError.message)
        } else {
          updatedCount++
          console.log(`✅ Updated block ${block.id} (${block.block_type})`)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 Block defaults fixed!\n')
    console.log(`📊 Summary:`)
    console.log(`   - Total blocks checked: ${blocks.length}`)
    console.log(`   - Blocks updated: ${updatedCount}`)
    console.log(`   - Blocks already correct: ${blocks.length - updatedCount}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Failed to fix block defaults:', error)
    process.exit(1)
  }
}

// Run the fix
fixBlockDefaults()
