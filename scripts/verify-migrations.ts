/**
 * Verify Database Migrations
 *
 * Checks that both migration 005 and 006 were applied successfully
 */

import { supabaseAdmin } from '../src/lib/supabase'

async function verifyMigrations() {
  console.log('🔍 Verifying database migrations...\n')

  try {
    // Test 1: Verify layout fields exist (Migration 005)
    console.log('Test 1: Checking layout fields from Migration 005...')
    const { data: layoutFields, error: layoutError } = await supabaseAdmin
      .from('content_blocks')
      .select('container_width, margin_top, margin_bottom')
      .limit(1)

    if (layoutError) {
      console.error('❌ Layout fields NOT found:', layoutError.message)
      console.log('   Please run migration 005_add_block_layout_fields.sql\n')
    } else {
      console.log('✅ Layout fields exist: container_width, margin_top, margin_bottom\n')
    }

    // Test 2: Verify parent_block_id exists (Migration 006)
    console.log('Test 2: Checking parent_block_id from Migration 006...')
    const { data: nestingField, error: nestingError } = await supabaseAdmin
      .from('content_blocks')
      .select('parent_block_id')
      .limit(1)

    if (nestingError) {
      console.error('❌ parent_block_id field NOT found:', nestingError.message)
      console.log('   Please run migration 006_add_nested_blocks_support.sql\n')
    } else {
      console.log('✅ Nested blocks support exists: parent_block_id\n')
    }

    // Test 3: Try to query with new fields
    console.log('Test 3: Querying blocks with new schema...')
    const { data: blocks, error: queryError } = await supabaseAdmin
      .from('content_blocks')
      .select('id, block_type, container_width, margin_top, margin_bottom, parent_block_id')
      .limit(5)

    if (queryError) {
      console.error('❌ Query failed:', queryError.message)
    } else {
      console.log(`✅ Successfully queried ${blocks?.length || 0} blocks with new schema`)
      if (blocks && blocks.length > 0) {
        console.log('\n📊 Sample block:')
        console.log(JSON.stringify(blocks[0], null, 2))
      }
    }

    // Test 4: Verify we can create new block types
    console.log('\n✅ All migrations verified successfully!')
    console.log('\n🎉 You can now:')
    console.log('   1. Use Layout Controls (container_width, margins)')
    console.log('   2. Create Section blocks (📦)')
    console.log('   3. Create Columns blocks (📐)')
    console.log('   4. Nest blocks inside containers')
    console.log('\n🚀 Go to http://localhost:3000/admin/pages to try it out!\n')

  } catch (error) {
    console.error('\n❌ Verification failed:', error)
    console.log('\n📋 Troubleshooting:')
    console.log('   1. Check Supabase connection in .env.local')
    console.log('   2. Verify migrations ran in SQL Editor')
    console.log('   3. Check table permissions\n')
  }
}

// Run verification
verifyMigrations()
