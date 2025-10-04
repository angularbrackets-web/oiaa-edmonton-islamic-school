import Programs from '@/components/Programs'

export const metadata = {
  title: 'Academic Programs | OIA Academy Edmonton',
  description: 'Explore our comprehensive Islamic education programs from kindergarten through high school. Excellence in academics and Islamic values.',
}

export default function ProgramsPage() {
  return (
    <main className="min-h-screen pt-32">
      {/* Page Hero */}
      <section className="relative bg-gradient-to-br from-terracotta-red to-terracotta-red-dark py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-geometric.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-6">Academic Programs</h1>
          <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl mx-auto">
            Excellence in Islamic education from kindergarten through high school graduation
          </p>
        </div>
      </section>

      {/* Programs Component */}
      <Programs />
    </main>
  )
}
