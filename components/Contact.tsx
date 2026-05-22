import { Button } from '@/components/ui/button'
import { Mail, GitFork, Link } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-xs text-primary">## ./contact</p>
        <h2 className="mb-4 text-2xl font-bold">Get in touch</h2>
        <p className="mb-10 max-w-md text-muted-foreground">
          I&apos;m open to new opportunities and interesting projects. My inbox is
          always open.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="mailto:you@example.com" aria-label="Email">
              <Mail className="mr-2 h-4 w-4" /> Email me
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitFork className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Link className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
