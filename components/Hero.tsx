import { buttonVariants } from '@/components/ui/button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="relative mx-auto max-w-5xl">

        {/* Line 1: $ whoami — cursor blinks forever */}
        <div className="mb-3 flex items-center font-mono text-sm text-primary">
          <span className="hero-typewriter-prompt">$ whoami</span>
          <span className="hero-cursor-blink" aria-hidden="true" />
        </div>

        {/* Line 2: name — cursor disappears after typing */}
        <div className="mb-3 flex items-baseline text-4xl font-black leading-tight tracking-tight md:text-6xl">
          <span className="hero-typewriter-name">
            Hi, I&apos;m{' '}
            <span className="text-primary">David Templeton</span>.
          </span>
          <span className="hero-cursor-name" aria-hidden="true" />
        </div>

        {/* Line 3: role — cursor disappears after typing */}
        <div className="mb-8 flex items-center font-mono text-sm text-muted-foreground md:text-base">
          <span className="hero-typewriter-role">
            Full-Stack Engineer &amp; UI Craftsman
          </span>
          <span className="hero-cursor-role" aria-hidden="true" />
        </div>

        {/* Buttons: fade in after typing completes */}
        <div className="hero-buttons-fade flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants()}>
            ./view-projects
          </a>
          <a href="/resume.pdf" download className={buttonVariants({ variant: 'outline' })}>
            ./download-resume
          </a>
        </div>

      </div>
    </section>
  )
}
