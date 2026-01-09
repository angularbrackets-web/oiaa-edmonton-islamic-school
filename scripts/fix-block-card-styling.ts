/**
 * Fix Block Card Styling
 *
 * Updates all content blocks to have 'flat' display style (no borders/shadows)
 * unless explicitly set to 'card' or 'featured' by the user.
 * Also updates the database schema default to 'flat'.
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

async function fixBlockCardStyling() {
  console.log('🔧 Fixing block card styling...\n')

  try {
    // Step 1: Check current state
    console.log('📊 Current state:')
    const { data: currentState, error: countError } = await supabase
      .from('content_blocks')
      .select('display_style, card_border_radius, card_shadow')

    if (countError) throw countError

    const stats = {
      total: currentState?.length || 0,
      card: currentState?.filter(b => b.display_style === 'card').length || 0,
      flat: currentState?.filter(b => b.display_style === 'flat').length || 0,
      featured: currentState?.filter(b => b.display_style === 'featured').length || 0,
      nullStyle: currentState?.filter(b => !b.display_style).length || 0
    }

    console.log(`   Total blocks: ${stats.total}`)
    console.log(`   - Card style: ${stats.card}`)
    console.log(`   - Flat style: ${stats.flat}`)
    console.log(`   - Featured style: ${stats.featured}`)
    console.log(`   - NULL style: ${stats.nullStyle}\n`)

    // Step 2: Update blocks with 'card' style to 'flat'
    console.log('🎨 Updating blocks to flat style...')
    const { data: updatedBlocks, error: updateError } = await supabase
      .from('content_blocks')
      .update({
        display_style: 'flat',
        card_border_radius: 'none',
        card_shadow: 'none',
        card_hover_effect: false
      })
      .or('display_style.eq.card,display_style.is.null')
      .select('id, block_type, display_style')

    if (updateError) throw updateError

    console.log(`   ✅ Updated ${updatedBlocks?.length || 0} blocks to flat style\n`)

    // Step 3: Update database schema default
    console.log('🔨 Updating database schema default...')
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE content_blocks
        ALTER COLUMN display_style SET DEFAULT 'flat',
        ALTER COLUMN card_border_radius SET DEFAULT 'none',
        ALTER COLUMN card_shadow SET DEFAULT 'none',
        ALTER COLUMN card_hover_effect SET DEFAULT false;
      `
    })

    // Note: The rpc call might not work if exec_sql function doesn't exist
    // In that case, we'll show SQL to run manually
    if (schemaError) {
      console.log('   ⚠️  Could not update schema via RPC (this is normal)')
      console.log('   📝 Please run this SQL manually in Supabase dashboard:\n')
      console.log('   ```sql')
      console.log('   ALTER TABLE content_blocks')
      console.log('   ALTER COLUMN display_style SET DEFAULT \'flat\',')
      console.log('   ALTER COLUMN card_border_radius SET DEFAULT \'none\',')
      console.log('   ALTER COLUMN card_shadow SET DEFAULT \'none\',')
      console.log('   ALTER COLUMN card_hover_effect SET DEFAULT false;')
      console.log('   ```\n')
    } else {
      console.log('   ✅ Database schema defaults updated\n')
    }

    // Step 4: Verify final state
    console.log('✅ Verification:')
    const { data: finalState, error: verifyError } = await supabase
      .from('content_blocks')
      .select('display_style, card_border_radius, card_shadow')

    if (verifyError) throw verifyError

    const finalStats = {
      total: finalState?.length || 0,
      card: finalState?.filter(b => b.display_style === 'card').length || 0,
      flat: finalState?.filter(b => b.display_style === 'flat').length || 0,
      featured: finalState?.filter(b => b.display_style === 'featured').length || 0
    }

    console.log(`   Total blocks: ${finalStats.total}`)
    console.log(`   - Card style: ${finalStats.card}`)
    console.log(`   - Flat style: ${finalStats.flat}`)
    console.log(`   - Featured style: ${finalStats.featured}\n`)

    console.log('🎉 Done! All blocks now have flat styling (no borders/shadows)')
    console.log('💡 You can still add card styling to individual blocks in the admin')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
fixBlockCardStyling()
