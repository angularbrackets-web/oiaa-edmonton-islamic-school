/**
 * Migrate Priority Pages to CMS
 *
 * Migrates the 3 most important pages:
 * 1. Mission & Vision
 * 2. Why Choose Us
 * 3. Our Story
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function migratePriorityPages() {
  console.log('🚀 Starting migration of priority pages...\n')

  try {
    // ========================================================================
    // 1. MISSION & VISION
    // ========================================================================
    console.log('📄 Creating: Mission & Vision...')

    const { data: missionPage, error: missionPageError } = await supabase
      .from('pages')
      .insert({
        slug: 'about-us/mission-vision',
        title: 'Our Mission & Vision',
        meta_description: 'Learn about our educational philosophy, mission, and vision for Islamic excellence in education.',
        status: 'published',
        is_published: true,
        template_type: 'standard'
      })
      .select()
      .single()

    if (missionPageError) {
      console.error('❌ Error creating Mission & Vision page:', missionPageError.message)
    } else {
      console.log('✅ Mission & Vision page created')

      // Add blocks
      const missionBlocks = [
        {
          page_id: missionPage.id,
          block_type: 'text',
          display_order: 0,
          content: {
            html: '<h2>🎯 Our Mission</h2><p class="text-lg">To provide an exceptional educational experience that nurtures confident, compassionate, and capable Muslim leaders who will contribute positively to society while maintaining strong Islamic identity and values.</p>'
          }
        },
        {
          page_id: missionPage.id,
          block_type: 'text',
          display_order: 1,
          content: {
            html: '<h2>🌟 Our Vision</h2><p class="text-lg">To be the leading Islamic educational institution in Western Canada, recognized for academic excellence, character development, and producing graduates who are prepared for success in both this world and the hereafter.</p>'
          }
        },
        {
          page_id: missionPage.id,
          block_type: 'text',
          display_order: 2,
          content: {
            html: `<h2>💎 Our Core Values</h2>
<div class="grid md:grid-cols-2 gap-6 my-6">
  <div class="p-4 bg-gray-50 rounded-lg">
    <h3 class="text-xl font-semibold text-terracotta-red mb-2">Islamic Excellence</h3>
    <p>Embodying the teachings of Islam in all aspects of education and life.</p>
  </div>
  <div class="p-4 bg-gray-50 rounded-lg">
    <h3 class="text-xl font-semibold text-terracotta-red mb-2">Academic Rigor</h3>
    <p>Maintaining high standards of academic achievement and critical thinking.</p>
  </div>
  <div class="p-4 bg-gray-50 rounded-lg">
    <h3 class="text-xl font-semibold text-terracotta-red mb-2">Character Development</h3>
    <p>Nurturing moral integrity, compassion, and ethical leadership.</p>
  </div>
  <div class="p-4 bg-gray-50 rounded-lg">
    <h3 class="text-xl font-semibold text-terracotta-red mb-2">Community Service</h3>
    <p>Encouraging active participation in serving the ummah and broader society.</p>
  </div>
</div>`
          }
        }
      ]

      const { error: missionBlocksError } = await supabase
        .from('content_blocks')
        .insert(missionBlocks)

      if (missionBlocksError) {
        console.error('❌ Error creating Mission & Vision blocks:', missionBlocksError.message)
      } else {
        console.log('✅ Added 3 blocks to Mission & Vision\n')
      }
    }

    // ========================================================================
    // 2. WHY CHOOSE US
    // ========================================================================
    console.log('📄 Creating: Why Choose Us...')

    const { data: whyPage, error: whyPageError } = await supabase
      .from('pages')
      .insert({
        slug: 'admissions/why-choose-us',
        title: 'Why Choose OIA Academy',
        meta_description: 'Discover what makes OIA Academy the premier choice for Islamic education in Edmonton.',
        status: 'published',
        is_published: true,
        template_type: 'standard'
      })
      .select()
      .single()

    if (whyPageError) {
      console.error('❌ Error creating Why Choose Us page:', whyPageError.message)
    } else {
      console.log('✅ Why Choose Us page created')

      // Add blocks
      const whyBlocks = [
        {
          page_id: whyPage.id,
          block_type: 'text',
          display_order: 0,
          content: {
            html: `<h2>What Sets Us Apart</h2>
<div class="grid md:grid-cols-3 gap-8 my-8">
  <div class="text-center">
    <div class="text-5xl mb-4">📚</div>
    <h3 class="text-2xl font-bold mb-3">Academic Excellence</h3>
    <p>Our curriculum meets and exceeds Alberta Education standards while integrating comprehensive Islamic studies, preparing students for university and beyond.</p>
  </div>

  <div class="text-center">
    <div class="text-5xl mb-4">🕌</div>
    <h3 class="text-2xl font-bold mb-3">Islamic Values</h3>
    <p>Deep integration of Islamic teachings, Quran memorization, Arabic language, and character development rooted in prophetic tradition.</p>
  </div>

  <div class="text-center">
    <div class="text-5xl mb-4">👨‍🏫</div>
    <h3 class="text-2xl font-bold mb-3">Qualified Educators</h3>
    <p>Certified teachers and Islamic scholars passionate about nurturing both academic success and spiritual growth in every student.</p>
  </div>

  <div class="text-center">
    <div class="text-5xl mb-4">🤝</div>
    <h3 class="text-2xl font-bold mb-3">Strong Community</h3>
    <p>Welcoming environment where families connect, students thrive, and Islamic values are lived daily in a supportive community.</p>
  </div>

  <div class="text-center">
    <div class="text-5xl mb-4">🎯</div>
    <h3 class="text-2xl font-bold mb-3">Holistic Development</h3>
    <p>Focus on intellectual, spiritual, physical, and social growth through diverse programs including sports, arts, and community service.</p>
  </div>

  <div class="text-center">
    <div class="text-5xl mb-4">🏆</div>
    <h3 class="text-2xl font-bold mb-3">Proven Success</h3>
    <p>98% university acceptance rate, provincial academic awards, and graduates excelling at top Canadian and international universities.</p>
  </div>
</div>`
          }
        },
        {
          page_id: whyPage.id,
          block_type: 'cta',
          display_order: 1,
          content: {
            title: 'Ready to Join Our Community?',
            description: 'Start your admission journey today and give your child the gift of Islamic excellence in education.',
            buttons: [
              {
                text: 'Start Application Process',
                url: '/admissions/application-process',
                style: 'primary'
              }
            ],
            alignment: 'center'
          }
        }
      ]

      const { error: whyBlocksError } = await supabase
        .from('content_blocks')
        .insert(whyBlocks)

      if (whyBlocksError) {
        console.error('❌ Error creating Why Choose Us blocks:', whyBlocksError.message)
      } else {
        console.log('✅ Added 2 blocks to Why Choose Us\n')
      }
    }

    // ========================================================================
    // 3. OUR STORY
    // ========================================================================
    console.log('📄 Creating: Our Story...')

    const { data: storyPage, error: storyPageError } = await supabase
      .from('pages')
      .insert({
        slug: 'about-us/our-story',
        title: 'Our Story',
        meta_description: 'Discover the history and journey of OIA Academy Edmonton from our founding to today.',
        status: 'published',
        is_published: true,
        template_type: 'standard'
      })
      .select()
      .single()

    if (storyPageError) {
      console.error('❌ Error creating Our Story page:', storyPageError.message)
    } else {
      console.log('✅ Our Story page created')

      // Add blocks
      const storyBlocks = [
        {
          page_id: storyPage.id,
          block_type: 'text',
          display_order: 0,
          content: {
            html: `<h2>Our Journey</h2>
<div class="space-y-6 my-8">
  <div class="flex gap-4 items-start">
    <span class="inline-block px-3 py-1 bg-terracotta-red text-white rounded-full text-sm font-semibold flex-shrink-0">2010</span>
    <div>
      <h3 class="text-xl font-semibold mb-2">Foundation</h3>
      <p>OIA Academy Edmonton was established by a group of dedicated community members who envisioned an educational institution that combines academic excellence with strong Islamic values.</p>
    </div>
  </div>

  <div class="flex gap-4 items-start">
    <span class="inline-block px-3 py-1 bg-terracotta-red text-white rounded-full text-sm font-semibold flex-shrink-0">2015</span>
    <div>
      <h3 class="text-xl font-semibold mb-2">Expansion</h3>
      <p>Expanded to serve grades K-12, increased enrollment to over 300 students, and added enhanced Islamic studies curriculum.</p>
    </div>
  </div>

  <div class="flex gap-4 items-start">
    <span class="inline-block px-3 py-1 bg-terracotta-red text-white rounded-full text-sm font-semibold flex-shrink-0">2020</span>
    <div>
      <h3 class="text-xl font-semibold mb-2">Excellence Recognition</h3>
      <p>Received provincial recognition for academic excellence and innovative Islamic curriculum integration. Student enrollment reached 500+.</p>
    </div>
  </div>

  <div class="flex gap-4 items-start">
    <span class="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold flex-shrink-0">2025</span>
    <div>
      <h3 class="text-xl font-semibold mb-2">New Centre Construction</h3>
      <p>Groundbreaking for our $5M Omar Ibn Al-Khattab Centre, a state-of-the-art 50,000 sq ft facility with modern classrooms, gymnasium, and prayer hall.</p>
    </div>
  </div>
</div>`
          }
        },
        {
          page_id: storyPage.id,
          block_type: 'text',
          display_order: 1,
          content: {
            html: `<h2>Our Achievements</h2>
<div class="grid md:grid-cols-3 gap-6 my-8 text-center">
  <div class="p-6 bg-gray-50 rounded-xl">
    <div class="text-5xl mb-4">🎓</div>
    <div class="text-4xl font-bold text-terracotta-red mb-2">98%</div>
    <p>University Acceptance Rate</p>
  </div>

  <div class="p-6 bg-gray-50 rounded-xl">
    <div class="text-5xl mb-4">👨‍👩‍👧‍👦</div>
    <div class="text-4xl font-bold text-terracotta-red mb-2">500+</div>
    <p>Students Served</p>
  </div>

  <div class="p-6 bg-gray-50 rounded-xl">
    <div class="text-5xl mb-4">🏆</div>
    <div class="text-4xl font-bold text-terracotta-red mb-2">15+</div>
    <p>Years of Excellence</p>
  </div>
</div>`
          }
        }
      ]

      const { error: storyBlocksError } = await supabase
        .from('content_blocks')
        .insert(storyBlocks)

      if (storyBlocksError) {
        console.error('❌ Error creating Our Story blocks:', storyBlocksError.message)
      } else {
        console.log('✅ Added 2 blocks to Our Story\n')
      }
    }

    console.log('\n🎉 Migration complete!')
    console.log('\n📊 Summary:')
    console.log('   ✅ Mission & Vision → /about-us/mission-vision')
    console.log('   ✅ Why Choose Us → /admissions/why-choose-us')
    console.log('   ✅ Our Story → /about-us/our-story')
    console.log('\n💡 Next: Update navigation database entries to point to these CMS pages')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migratePriorityPages()
