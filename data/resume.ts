export type Experience = {
  company: string
  role: string
  period: string
  bullets: string[]
}

export type Education = {
  school: string
  degree: string
  year: string
}

export type ResumeData = {
  hasDocx: boolean
  experience: Experience[]
  education: Education[]
}

export const resume: ResumeData = {
  hasDocx: false,
  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Full-Stack Engineer',
      period: '2022 – Present',
      bullets: [
        'Led migration of monolith to microservices, reducing p99 latency by 40%.',
        'Built internal design system adopted by 5 product teams.',
        'Mentored 3 junior engineers through code review and pair programming.',
      ],
    },
    {
      company: 'Startup XYZ',
      role: 'Full-Stack Engineer',
      period: '2020 – 2022',
      bullets: [
        'Shipped user-facing features in Next.js serving 50k MAU.',
        'Designed and built REST API with Go and PostgreSQL.',
      ],
    },
  ],
  education: [
    {
      school: 'State University',
      degree: 'B.S. Computer Science',
      year: '2020',
    },
  ],
}
