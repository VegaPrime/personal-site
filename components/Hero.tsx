'use client'

import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const animClass = `transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className={animClass} style={{ transitionDelay: '0ms' }}>
          <p className="mb-3 font-mono text-sm text-primary">$ whoami</p>
        </div>
        <div className={animClass} style={{ transitionDelay: '100ms' }}>
          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Hi, I&apos;m{' '}
            <span className="text-primary">David Templeton</span>.
          </h1>
        </div>
        <div className={animClass} style={{ transitionDelay: '200ms' }}>
          <p className="mb-8 font-mono text-sm text-muted-foreground md:text-base">
            Full-Stack Engineer &amp; UI Craftsman
          </p>
        </div>
        <div className={animClass} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className={buttonVariants()}>
              ./view-projects
            </a>
            <a href="/resume.pdf" download className={buttonVariants({ variant: 'outline' })}>
              ./download-resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
