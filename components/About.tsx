import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/FadeIn'
import { resume } from '@/data/resume'

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./about</p>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About me</h2>
              <p className="leading-relaxed text-base text-foreground/80">
                Senior Frontend Engineer with 8+ years building high-traffic,
                customer-facing web applications using React, Next.js, TypeScript,
                and Node. Experienced delivering enterprise and ecommerce platforms
                including Home Depot, NCR, Deloitte, and Honeywell. Focused on
                performance, scalability, accessibility, and measurable business
                impact including conversion, engagement, and page performance.
              </p>
              <p className="mt-4 leading-relaxed text-base text-foreground/80">
                Strong collaborator who translates product goals into scalable
                frontend architecture, mentors engineers, and drives modern
                engineering practices.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <FadeIn key={skill} delay={index * 60}>
                    <Badge variant="outline" data-testid="skill-badge">
                      {skill}
                    </Badge>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
