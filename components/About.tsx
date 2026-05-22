import { Badge } from '@/components/ui/badge'

const skills = [
  'TypeScript', 'React', 'Next.js', 'Node.js',
  'Go', 'PostgreSQL', 'Redis', 'Docker',
  'AWS', 'Tailwind CSS', 'GraphQL', 'Git',
]

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-xs text-primary">## ./about</p>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About me</h2>
            <p className="leading-relaxed text-muted-foreground">
              I&apos;m a full-stack engineer with 5+ years of experience building
              scalable web applications. I care deeply about clean architecture,
              fast user interfaces, and developer tooling that doesn&apos;t get
              in the way.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              When I&apos;m not shipping product, I&apos;m contributing to open
              source or writing about systems design.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" data-testid="skill-badge">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
