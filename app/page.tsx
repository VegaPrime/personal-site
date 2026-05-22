import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <footer className="border-t border-border px-6 py-8 text-center font-mono text-xs text-muted-foreground">
        <p>Built with Next.js + shadcn/ui · {new Date().getFullYear()}</p>
      </footer>
    </>
  )
}
