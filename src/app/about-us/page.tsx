import Faculty from '@/components/Faculty'

export const metadata = {
  title: 'About Us - Our Faculty & Staff | OIA Academy Edmonton',
  description: 'Meet our dedicated faculty and staff committed to excellence in Islamic education. Teachers, support staff, sheikhs, and administrators.',
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen pt-32">
      {/* Page Hero */}
      <section className="relative bg-gradient-to-br from-sage-green to-deep-teal py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-geometric.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-6">Our Faculty & Staff</h1>
          <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl mx-auto">
            Meet the dedicated team nurturing the next generation of Muslim leaders
          </p>
          <p className="text-lg text-warm-white/80 mt-4 max-w-2xl mx-auto">
            Our community includes experienced teachers, supportive staff, knowledgeable sheikhs, and committed administrators - all working together to provide excellence in Islamic education.
          </p>
        </div>
      </section>

      {/* Faculty Component */}
      <Faculty />
    </main>
  )
}
