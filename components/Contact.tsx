import { buttonVariants } from '@/components/ui/button'
import { Mail, GitFork, Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/FadeIn'

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./contact</p>
          <h2 className="mb-4 text-2xl font-bold">Get in touch</h2>
          <p className="mb-10 max-w-md text-muted-foreground">
            I&apos;m open to new opportunities and interesting projects. My inbox is
            always open.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:d.j.templeton7@gmail.com" aria-label="Email" className={buttonVariants()}>
              <Mail className="mr-2 h-4 w-4" /> Email me
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <GitFork className="mr-2 h-4 w-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/templetondavid/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <Link className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
