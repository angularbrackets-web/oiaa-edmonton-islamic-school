/**
 * Navigation Data Seeder
 *
 * Seeds the navigation_items table with all 36 menu items
 * (8 top-level + 28 sub-items) as specified in requirements.
 *
 * Usage:
 *   npm run seed-navigation
 *   OR
 *   tsx scripts/seed-navigation.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface NavigationSeedData {
  label_en: string
  label_ar?: string
  href: string
  icon?: string
  level: 1 | 2
  parent_id?: string
  display_order: number
  is_visible: boolean
  is_featured: boolean
  description_en?: string
  description_ar?: string
  page_title_en?: string
  page_title_ar?: string
  meta_description_en?: string
  meta_description_ar?: string
}

/**
 * Top-level navigation items (8 items)
 */
const topLevelItems: NavigationSeedData[] = [
  {
    label_en: 'Home',
    label_ar: 'الرئيسية',
    href: '/',
    icon: '🏠',
    level: 1,
    display_order: 1,
    is_visible: true,
    is_featured: false,
    page_title_en: 'Home - OIA Academy Edmonton',
    page_title_ar: 'الرئيسية - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Welcome to OIA Academy Edmonton - Providing quality Islamic education',
    meta_description_ar: 'مرحبا بكم في أكاديمية عمر بن الخطاب إدمنتون - نقدم تعليماً إسلامياً عالي الجودة'
  },
  {
    label_en: 'About Us',
    label_ar: 'معلومات عنا',
    href: '/about-us',
    icon: '📘',
    level: 1,
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Learn about our mission, values, and team',
    description_ar: 'تعرف على مهمتنا وقيمنا وفريقنا',
    page_title_en: 'About Us - OIA Academy Edmonton',
    page_title_ar: 'معلومات عنا - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Learn about OIA Academy\'s mission, vision, history, and dedicated team',
    meta_description_ar: 'تعرف على رسالة ورؤية وتاريخ أكاديمية عمر بن الخطاب وفريقها المخلص'
  },
  {
    label_en: 'Admissions',
    label_ar: 'القبول والتسجيل',
    href: '/admissions',
    icon: '🎓',
    level: 1,
    display_order: 3,
    is_visible: true,
    is_featured: true,
    description_en: 'Join our school community - enrollment information',
    description_ar: 'انضم إلى مجتمع مدرستنا - معلومات التسجيل',
    page_title_en: 'Admissions - OIA Academy Edmonton',
    page_title_ar: 'القبول والتسجيل - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Admission process, requirements, and enrollment information for OIA Academy',
    meta_description_ar: 'عملية القبول والمتطلبات ومعلومات التسجيل في أكاديمية عمر بن الخطاب'
  },
  {
    label_en: 'Academics',
    label_ar: 'الأكاديميات',
    href: '/academics',
    icon: '📚',
    level: 1,
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Our curriculum, programs, and educational approach',
    description_ar: 'منهجنا وبرامجنا ونهجنا التعليمي',
    page_title_en: 'Academics - OIA Academy Edmonton',
    page_title_ar: 'الأكاديميات - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Explore our comprehensive academic programs and Islamic curriculum',
    meta_description_ar: 'استكشف برامجنا الأكاديمية الشاملة ومنهجنا الإسلامي'
  },
  {
    label_en: 'News & Events',
    label_ar: 'الأخبار والفعاليات',
    href: '/news-events',
    icon: '🗞️',
    level: 1,
    display_order: 5,
    is_visible: true,
    is_featured: false,
    description_en: 'Stay updated with school news and upcoming events',
    description_ar: 'ابق على اطلاع بأخبار المدرسة والفعاليات القادمة',
    page_title_en: 'News & Events - OIA Academy Edmonton',
    page_title_ar: 'الأخبار والفعاليات - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Latest news, announcements, and upcoming events at OIA Academy',
    meta_description_ar: 'آخر الأخبار والإعلانات والفعاليات القادمة في أكاديمية عمر بن الخطاب'
  },
  {
    label_en: 'New Centre',
    label_ar: 'المركز الجديد',
    href: '/new-centre',
    icon: '🏗️',
    level: 1,
    display_order: 6,
    is_visible: true,
    is_featured: true,
    description_en: 'Our new facility construction project',
    description_ar: 'مشروع بناء منشأتنا الجديدة',
    page_title_en: 'New Centre Project - OIA Academy Edmonton',
    page_title_ar: 'مشروع المركز الجديد - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Learn about our new centre construction project and how you can support',
    meta_description_ar: 'تعرف على مشروع بناء مركزنا الجديد وكيف يمكنك الدعم'
  },
  {
    label_en: 'Donate',
    label_ar: 'تبرع',
    href: '/donate',
    icon: '💝',
    level: 1,
    display_order: 7,
    is_visible: true,
    is_featured: true,
    description_en: 'Support our mission and students',
    description_ar: 'ادعم مهمتنا وطلابنا',
    page_title_en: 'Donate - Support OIA Academy Edmonton',
    page_title_ar: 'تبرع - ادعم أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Make a difference - support Islamic education at OIA Academy Edmonton',
    meta_description_ar: 'أحدث فرقاً - ادعم التعليم الإسلامي في أكاديمية عمر بن الخطاب إدمنتون'
  },
  {
    label_en: 'Contact Us',
    label_ar: 'اتصل بنا',
    href: '/contact',
    icon: '📞',
    level: 1,
    display_order: 8,
    is_visible: true,
    is_featured: false,
    description_en: 'Get in touch with our team',
    description_ar: 'تواصل مع فريقنا',
    page_title_en: 'Contact Us - OIA Academy Edmonton',
    page_title_ar: 'اتصل بنا - أكاديمية عمر بن الخطاب إدمنتون',
    meta_description_en: 'Contact OIA Academy Edmonton - location, hours, and contact information',
    meta_description_ar: 'اتصل بأكاديمية عمر بن الخطاب إدمنتون - الموقع والساعات ومعلومات الاتصال'
  }
]

/**
 * Sub-menu items generator function
 * Creates sub-items after parent IDs are known
 */
const createSubMenuItems = (parentIds: Record<string, string>): NavigationSeedData[] => [
  // ABOUT US Sub-items (5)
  {
    label_en: 'Our Mission & Vision',
    label_ar: 'مهمتنا ورؤيتنا',
    href: '/about-us/mission-vision',
    level: 2,
    parent_id: parentIds['About Us'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'Our guiding principles and future goals',
    description_ar: 'مبادئنا التوجيهية وأهدافنا المستقبلية'
  },
  {
    label_en: 'Our Story',
    label_ar: 'قصتنا',
    href: '/about-us/our-story',
    level: 2,
    parent_id: parentIds['About Us'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'The history and founding of OIA Academy',
    description_ar: 'تاريخ وتأسيس أكاديمية عمر بن الخطاب'
  },
  {
    label_en: 'Our Board',
    label_ar: 'مجلس الإدارة',
    href: '/about-us/board',
    level: 2,
    parent_id: parentIds['About Us'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'Meet our board of directors',
    description_ar: 'تعرف على مجلس إدارتنا'
  },
  {
    label_en: 'Our Staff & Faculty',
    label_ar: 'موظفونا وهيئة التدريس',
    href: '/about-us/staff-faculty',
    level: 2,
    parent_id: parentIds['About Us'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Our dedicated educators and staff',
    description_ar: 'معلمونا وموظفونا المخلصون'
  },
  {
    label_en: 'Careers / Join Our Team',
    label_ar: 'الوظائف / انضم إلى فريقنا',
    href: '/about-us/careers',
    level: 2,
    parent_id: parentIds['About Us'],
    display_order: 5,
    is_visible: true,
    is_featured: false,
    description_en: 'Employment opportunities at OIA Academy',
    description_ar: 'فرص العمل في أكاديمية عمر بن الخطاب'
  },

  // ADMISSIONS Sub-items (5)
  {
    label_en: 'Why Choose Us',
    label_ar: 'لماذا تختارنا',
    href: '/admissions/why-choose-us',
    level: 2,
    parent_id: parentIds['Admissions'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'What makes OIA Academy special',
    description_ar: 'ما الذي يجعل أكاديمية عمر بن الخطاب مميزة'
  },
  {
    label_en: 'Application Process',
    label_ar: 'عملية التقديم',
    href: '/admissions/application-process',
    level: 2,
    parent_id: parentIds['Admissions'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Step-by-step enrollment guide',
    description_ar: 'دليل التسجيل خطوة بخطوة'
  },
  {
    label_en: 'Fee Structure',
    label_ar: 'هيكل الرسوم',
    href: '/admissions/fee-structure',
    level: 2,
    parent_id: parentIds['Admissions'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'Tuition and payment information',
    description_ar: 'معلومات الرسوم الدراسية والدفع'
  },
  {
    label_en: 'FAQs',
    label_ar: 'الأسئلة الشائعة',
    href: '/admissions/faqs',
    level: 2,
    parent_id: parentIds['Admissions'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Frequently asked questions about admissions',
    description_ar: 'الأسئلة المتكررة حول القبول'
  },
  {
    label_en: 'Request a Tour / Enquiry',
    label_ar: 'اطلب جولة / استفسار',
    href: '/admissions/tour-enquiry',
    level: 2,
    parent_id: parentIds['Admissions'],
    display_order: 5,
    is_visible: true,
    is_featured: true,
    description_en: 'Schedule a visit to our campus',
    description_ar: 'جدولة زيارة إلى حرمنا الجامعي'
  },

  // ACADEMICS Sub-items (4)
  {
    label_en: 'Programs Overview',
    label_ar: 'نظرة عامة على البرامج',
    href: '/academics/programs-overview',
    level: 2,
    parent_id: parentIds['Academics'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'All our academic programs at a glance',
    description_ar: 'جميع برامجنا الأكاديمية في لمحة'
  },
  {
    label_en: 'Elementary / Middle / High School',
    label_ar: 'الابتدائية / المتوسطة / الثانوية',
    href: '/academics/grade-levels',
    level: 2,
    parent_id: parentIds['Academics'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Programs by grade level',
    description_ar: 'البرامج حسب المستوى الدراسي'
  },
  {
    label_en: 'Islamic Studies Curriculum',
    label_ar: 'منهج الدراسات الإسلامية',
    href: '/academics/islamic-curriculum',
    level: 2,
    parent_id: parentIds['Academics'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'Quran, Hadith, Arabic, and Islamic studies',
    description_ar: 'القرآن والحديث والعربية والدراسات الإسلامية'
  },
  {
    label_en: 'Extracurriculars & Clubs',
    label_ar: 'الأنشطة اللامنهجية والنوادي',
    href: '/academics/extracurriculars',
    level: 2,
    parent_id: parentIds['Academics'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Sports, arts, and enrichment activities',
    description_ar: 'الرياضة والفنون وأنشطة الإثراء'
  },

  // NEWS & EVENTS Sub-items (4)
  {
    label_en: 'Announcements',
    label_ar: 'الإعلانات',
    href: '/news-events/announcements',
    level: 2,
    parent_id: parentIds['News & Events'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'Latest school announcements',
    description_ar: 'آخر إعلانات المدرسة'
  },
  {
    label_en: 'School Calendar',
    label_ar: 'التقويم المدرسي',
    href: '/news-events/calendar',
    level: 2,
    parent_id: parentIds['News & Events'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Important dates and events',
    description_ar: 'التواريخ والأحداث المهمة'
  },
  {
    label_en: 'Photo Gallery / Media',
    label_ar: 'معرض الصور / الوسائط',
    href: '/news-events/gallery',
    level: 2,
    parent_id: parentIds['News & Events'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'Photos and videos from school events',
    description_ar: 'الصور ومقاطع الفيديو من فعاليات المدرسة'
  },
  {
    label_en: 'Past Events Archive',
    label_ar: 'أرشيف الأحداث السابقة',
    href: '/news-events/archive',
    level: 2,
    parent_id: parentIds['News & Events'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Browse past school events',
    description_ar: 'تصفح فعاليات المدرسة السابقة'
  },

  // NEW CENTRE Sub-items (4)
  {
    label_en: 'Project Overview',
    label_ar: 'نظرة عامة على المشروع',
    href: '/new-centre/overview',
    level: 2,
    parent_id: parentIds['New Centre'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'About our new facility project',
    description_ar: 'حول مشروع منشأتنا الجديدة'
  },
  {
    label_en: 'Progress Updates / Gallery',
    label_ar: 'تحديثات التقدم / المعرض',
    href: '/new-centre/progress',
    level: 2,
    parent_id: parentIds['New Centre'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Construction progress and photos',
    description_ar: 'التقدم في البناء والصور'
  },
  {
    label_en: 'Support the Project (Donate)',
    label_ar: 'ادعم المشروع (تبرع)',
    href: '/new-centre/support',
    level: 2,
    parent_id: parentIds['New Centre'],
    display_order: 3,
    is_visible: true,
    is_featured: true,
    description_en: 'Help fund our new centre',
    description_ar: 'ساعد في تمويل مركزنا الجديد'
  },
  {
    label_en: 'FAQs',
    label_ar: 'الأسئلة الشائعة',
    href: '/new-centre/faqs',
    level: 2,
    parent_id: parentIds['New Centre'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Common questions about the new centre',
    description_ar: 'الأسئلة الشائعة حول المركز الجديد'
  },

  // DONATE Sub-items (3)
  {
    label_en: 'Ways to Give',
    label_ar: 'طرق التبرع',
    href: '/donate/ways-to-give',
    level: 2,
    parent_id: parentIds['Donate'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'Different donation options available',
    description_ar: 'خيارات التبرع المختلفة المتاحة'
  },
  {
    label_en: 'Impact Stories',
    label_ar: 'قصص الأثر',
    href: '/donate/impact-stories',
    level: 2,
    parent_id: parentIds['Donate'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'How your donations make a difference',
    description_ar: 'كيف تحدث تبرعاتك فرقاً'
  },
  {
    label_en: 'Volunteer Opportunities',
    label_ar: 'فرص التطوع',
    href: '/donate/volunteer',
    level: 2,
    parent_id: parentIds['Donate'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'Give your time and skills',
    description_ar: 'تبرع بوقتك ومهاراتك'
  },

  // CONTACT US Sub-items (4)
  {
    label_en: 'Contact Form',
    label_ar: 'نموذج الاتصال',
    href: '/contact/form',
    level: 2,
    parent_id: parentIds['Contact Us'],
    display_order: 1,
    is_visible: true,
    is_featured: false,
    description_en: 'Send us a message',
    description_ar: 'أرسل لنا رسالة'
  },
  {
    label_en: 'Location / Map',
    label_ar: 'الموقع / الخريطة',
    href: '/contact/location',
    level: 2,
    parent_id: parentIds['Contact Us'],
    display_order: 2,
    is_visible: true,
    is_featured: false,
    description_en: 'Find us on the map',
    description_ar: 'اعثر علينا على الخريطة'
  },
  {
    label_en: 'Office Hours',
    label_ar: 'ساعات العمل',
    href: '/contact/hours',
    level: 2,
    parent_id: parentIds['Contact Us'],
    display_order: 3,
    is_visible: true,
    is_featured: false,
    description_en: 'When we are available',
    description_ar: 'متى نكون متاحين'
  },
  {
    label_en: 'Social Media Links',
    label_ar: 'روابط وسائل التواصل الاجتماعي',
    href: '/contact/social-media',
    level: 2,
    parent_id: parentIds['Contact Us'],
    display_order: 4,
    is_visible: true,
    is_featured: false,
    description_en: 'Follow us on social media',
    description_ar: 'تابعنا على وسائل التواصل الاجتماعي'
  }
]

/**
 * Main seeding function
 */
async function seedNavigation() {
  console.log('🌱 Starting navigation data seeding...\n')

  try {
    // Check if table exists and has data
    const { data: existingData, error: checkError } = await supabase
      .from('navigation_items')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking navigation_items table:', checkError.message)
      console.error('Please ensure the migration has been run first.')
      process.exit(1)
    }

    if (existingData && existingData.length > 0) {
      console.log('⚠️  Navigation items already exist in database.')
      console.log('Do you want to clear existing data and reseed? (y/N)')

      // In production, you might want to implement proper prompt here
      // For now, we'll exit to prevent accidental data loss
      console.log('Exiting to prevent data loss. Manually delete records if you want to reseed.')
      process.exit(0)
    }

    // Step 1: Insert top-level items
    console.log('📝 Inserting top-level navigation items...')
    const { data: insertedTopLevel, error: topLevelError } = await supabase
      .from('navigation_items')
      .insert(topLevelItems)
      .select('id, label_en')

    if (topLevelError) {
      throw new Error(`Failed to insert top-level items: ${topLevelError.message}`)
    }

    console.log(`✅ Inserted ${insertedTopLevel.length} top-level items`)

    // Step 2: Create parent ID mapping
    const parentIds: Record<string, string> = {}
    insertedTopLevel.forEach((item: any) => {
      parentIds[item.label_en] = item.id
    })

    console.log('\n📝 Inserting sub-menu items...')

    // Step 3: Insert sub-menu items
    const subMenuItems = createSubMenuItems(parentIds)
    const { data: insertedSubMenu, error: subMenuError } = await supabase
      .from('navigation_items')
      .insert(subMenuItems)
      .select('id, label_en, parent_id')

    if (subMenuError) {
      throw new Error(`Failed to insert sub-menu items: ${subMenuError.message}`)
    }

    console.log(`✅ Inserted ${insertedSubMenu.length} sub-menu items`)

    // Step 4: Verify counts
    const { count, error: countError } = await supabase
      .from('navigation_items')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Failed to verify counts: ${countError.message}`)
    }

    console.log(`\n✨ Successfully seeded navigation data!`)
    console.log(`📊 Total items in database: ${count}`)
    console.log(`   - Top-level items: ${insertedTopLevel.length}`)
    console.log(`   - Sub-menu items: ${insertedSubMenu.length}`)

    // Display structure
    console.log('\n📋 Navigation Structure:')
    for (const parent of insertedTopLevel) {
      const children = insertedSubMenu.filter((child: any) => child.parent_id === parent.id)
      console.log(`   ${parent.label_en} (${children.length} children)`)
    }

    console.log('\n🎉 Seeding completed successfully!')

  } catch (error) {
    console.error('\n❌ Error during seeding:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
    }
    process.exit(1)
  }
}

// Run the seeder
seedNavigation()
  .then(() => {
    console.log('\n👋 Exiting...')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error)
    process.exit(1)
  })
