import Hero from '@/components/Hero'
import About from '@/components/About'
import News from '@/components/News'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import DynamicComponentSection from '@/components/DynamicComponentSection'
import { supabase } from '@/lib/supabase'
import { HomeSection } from '@/types/cms'

// Force dynamic rendering to always fetch fresh section ordering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Fetch home sections server-side
async function getHomeSections(): Promise<HomeSection[]> {
  try {
    const { data, error } = await supabase
      .from('home_sections')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching home sections:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Component map
const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  Hero,
  About,
  News,
  Contact
}

// Background wrapper for sections
function SectionWrapper({
  section,
  children
}: {
  section: HomeSection
  children: React.ReactNode
}) {
  const config = section.config || {}

  // Check if section has diagonal background
  if (config.background === 'diagonal' && config.colors) {
    const [color1, color2, color3, color4] = config.colors

    return (
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-${color1} to-${color2}`}
            style={{
              clipPath: section.section_id === 'news'
                ? `polygon(0% 0%, 65% 0%, 35% 100%, 0% 100%)`
                : `polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)`
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br from-${color3} to-${color4}`}
            style={{
              clipPath: section.section_id === 'news'
                ? `polygon(35% 0%, 100% 0%, 100% 100%, 65% 100%)`
                : `polygon(20% 0%, 100% 0%, 100% 100%, 80% 100%)`
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </section>
    )
  }

  // No wrapper, just render children
  return <>{children}</>
}

export default async function Home() {
  const sections = await getHomeSections()

  return (
    <main className="min-h-screen">
      {sections.map((section) => {
        // Check if this section uses a reusable component
        if (section.component_id) {
          return (
            <SectionWrapper key={section.id} section={section}>
              <DynamicComponentSection section={section} />
            </SectionWrapper>
          )
        }

        // Fall back to legacy hardcoded components
        const SectionComponent = SECTION_COMPONENTS[section.section_type]

        if (!SectionComponent) {
          console.warn(`Component not found for section type: ${section.section_type}`)
          return null
        }

        return (
          <SectionWrapper key={section.id} section={section}>
            <SectionComponent />
          </SectionWrapper>
        )
      })}
      <Footer />
    </main>
  )
}
