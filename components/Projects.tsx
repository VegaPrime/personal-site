import { projects } from '@/data/projects'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { GitFork, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-xs text-primary">## ./projects</p>
        <h2 className="mb-10 text-2xl font-bold">Projects</h2>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <Card key={project.title} className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-primary">
                  ■ {project.title}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="outline" className="font-mono text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      <GitFork className="mr-1 h-3 w-3" /> GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" /> Live
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {rest.map((project) => (
              <Card key={project.title} className="bg-card/30">
                <CardHeader className="pb-2">
                  <CardTitle className="font-mono text-xs text-primary">
                    ■ {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="font-mono text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2 px-0')}
                    >
                      <GitFork className="mr-1 h-3 w-3" /> GitHub
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
