import { resume } from '@/data/resume'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import { FadeIn } from '@/components/FadeIn'

export default function Resume() {
  return (
    <section id="resume" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./resume</p>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">Resume</h2>
            <a href="/resume.pdf" download className={buttonVariants({ size: 'sm' })}>
              <Download className="mr-1 h-3 w-3" /> Download PDF
            </a>
            {resume.hasDocx && (
              <a href="/resume.docx" download className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Download className="mr-1 h-3 w-3" /> Download Word
              </a>
            )}
          </div>

          <h3 className="mb-4 text-lg font-semibold">Experience</h3>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div
                key={exp.company}
                className="rounded-lg border border-border/50 bg-card/50 p-5 md:p-6"
              >
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold">{exp.company}</span>
                  <span className="font-mono text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="mb-4 text-sm text-primary">{exp.role}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 text-primary">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {resume.education.length > 0 && (
            <>
              <Separator className="my-8" />
              <h3 className="mb-6 text-lg font-semibold">Education</h3>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.school} className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="font-semibold">{edu.school}</span>
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{edu.year}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
