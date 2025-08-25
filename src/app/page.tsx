import Hero from '@/components/Hero'
import About from '@/components/About'
import Programs from '@/components/Programs'
import Faculty from '@/components/Faculty'
import News from '@/components/News'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <News />
      <About />
      <Programs />
      <Faculty />
      <Contact />
      <Footer />
    </main>
  )
}