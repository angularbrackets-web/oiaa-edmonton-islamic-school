/**
 * Cleanup Flat Blocks Script
 *
 * Fixes blocks that have display_style='flat' but still have card properties set.
 * This was causing borders/shadows to appear even when flat was selected.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function cleanupFlatBlocks() {
  console.log('🧹 Cleaning up flat blocks with card properties...\n')

  try {
    // Step 1: Find blocks that are flat but have card properties
    console.log('🔍 Finding blocks with display_style=flat but card properties set...')
    const { data: problematicBlocks, error: fetchError } = await supabase
      .from('content_blocks')
      .select('id, block_type, display_style, card_border_radius, card_shadow, card_hover_effect')
      .eq('display_style', 'flat')
      .or('card_border_radius.neq.none,card_shadow.neq.none,card_hover_effect.eq.true')

    if (fetchError) throw fetchError

    console.log(`   Found ${problematicBlocks?.length || 0} blocks to fix\n`)

    if (!problematicBlocks || problematicBlocks.length === 0) {
      console.log('✅ No blocks need fixing! All flat blocks are clean.')
      return
    }

    // Show sample of what will be fixed
    console.log('📋 Sample of blocks to fix:')
    problematicBlocks.slice(0, 5).forEach(block => {
      console.log(`   - ${block.block_type} (${block.id.substring(0, 8)}...): radius=${block.card_border_radius}, shadow=${block.card_shadow}, hover=${block.card_hover_effect}`)
    })
    console.log()

    // Step 2: Update all flat blocks to have no card properties
    console.log('🔧 Resetting card properties on flat blocks...')
    const { data: updatedBlocks, error: updateError } = await supabase
      .from('content_blocks')
      .update({
        card_border_radius: 'none',
        card_shadow: 'none',
        card_hover_effect: false,
        card_border_color: null
      })
      .eq('display_style', 'flat')
      .select('id')

    if (updateError) throw updateError

    console.log(`   ✅ Updated ${updatedBlocks?.length || 0} blocks\n`)

    // Step 3: Verify the fix
    console.log('✅ Verification:')
    const { data: verifyBlocks, error: verifyError } = await supabase
      .from('content_blocks')
      .select('id, display_style, card_border_radius, card_shadow, card_hover_effect')
      .eq('display_style', 'flat')
      .or('card_border_radius.neq.none,card_shadow.neq.none,card_hover_effect.eq.true')

    if (verifyError) throw verifyError

    if (verifyBlocks && verifyBlocks.length > 0) {
      console.log(`   ⚠️  Warning: ${verifyBlocks.length} blocks still have card properties`)
      console.log('   This may be due to NULL values. Run again if needed.')
    } else {
      console.log('   ✅ All flat blocks are now clean!')
      console.log('   No borders, shadows, or hover effects on flat blocks')
    }

    console.log('\n🎉 Done! Refresh your browser to see the changes.')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
cleanupFlatBlocks()
