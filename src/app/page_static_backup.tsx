import Hero from '@/components/Hero'
import About from '@/components/About'
// import Programs from '@/components/Programs' // Moved to dedicated /programs page
// import Faculty from '@/components/Faculty' // Moved to dedicated /about-us page
import News from '@/components/News'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero section - Reduced height for cleaner homepage */}
      <Hero />

      {/* News section with diagonal background */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-900"
            style={{
              clipPath: `polygon(0% 0%, 65% 0%, 35% 100%, 0% 100%)`
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-rose-800 to-red-900"
            style={{
              clipPath: `polygon(35% 0%, 100% 0%, 100% 100%, 65% 100%)`
            }}
          />
        </div>
        <div className="relative z-10">
          <News />
        </div>
      </section>

      {/* About section - Simplified (removed Journey timeline) */}
      <About />

      {/* REMOVED: Programs section - Now available at /programs page */}
      {/* REMOVED: Faculty section - Now available at /about-us page */}

      {/* Contact section with diagonal background */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800"
            style={{
              clipPath: `polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)`
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-800 to-red-700"
            style={{
              clipPath: `polygon(20% 0%, 100% 0%, 100% 100%, 80% 100%)`
            }}
          />
        </div>
        <div className="relative z-10">
          <Contact />
        </div>
      </section>
      <Footer />
    </main>
  )
}