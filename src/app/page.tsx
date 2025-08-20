import Hero from '@/components/Hero'
import About from '@/components/About'
import Programs from '@/components/Programs'
import Faculty from '@/components/Faculty'
import News from '@/components/News'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Programs />
      <Faculty />
      <News />
      <Contact />
    </main>
  )
}