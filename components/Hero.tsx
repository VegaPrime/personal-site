import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      {/* Dark mode gradient glow — background atmosphere, not accent color */}
      <div className="pointer-events-none absolute -right-20 -top-20 hidden h-72 w-72 rounded-full bg-purple-600/20 blur-3xl dark:block" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 hidden h-56 w-56 rounded-full bg-blue-600/15 blur-3xl dark:block" />

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-3 font-mono text-sm text-primary">$ whoami</p>
        <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight md:text-6xl">
          Hi, I&apos;m{' '}
          <span className="text-primary">Your Name</span>.
        </h1>
        <p className="mb-8 font-mono text-sm text-muted-foreground md:text-base">
          Full-Stack Engineer &amp; UI Craftsman
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="#projects">./view-projects</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/resume.pdf" download>./download-resume</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
