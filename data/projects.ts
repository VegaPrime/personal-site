export type Project = {
  title: string
  description: string
  stack: string[]
  github?: string
  live?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    title: 'Project Alpha',
    description: 'A full-stack SaaS boilerplate with auth, billing, and team management.',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Stripe'],
    github: 'https://github.com/username/project-alpha',
    live: 'https://project-alpha.dev',
    featured: true,
  },
  {
    title: 'Go Gateway',
    description: 'High-performance API gateway with rate limiting and circuit breaking.',
    stack: ['Go', 'Redis', 'Docker'],
    github: 'https://github.com/username/go-gateway',
    featured: true,
  },
  {
    title: 'CLI Toolkit',
    description: 'Collection of developer productivity scripts and shell utilities.',
    stack: ['TypeScript', 'Node.js'],
    github: 'https://github.com/username/cli-toolkit',
    featured: false,
  },
]
