import { projects, type Project } from '@/data/projects'
import { resume, type ResumeData } from '@/data/resume'

describe('data/projects', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    projects.forEach((p: Project) => {
      expect(typeof p.title).toBe('string')
      expect(typeof p.description).toBe('string')
      expect(Array.isArray(p.stack)).toBe(true)
      expect(typeof p.featured).toBe('boolean')
    })
  })
})

describe('data/resume', () => {
  it('exports resume with hasDocx flag', () => {
    expect(typeof resume.hasDocx).toBe('boolean')
  })

  it('has at least one experience entry', () => {
    expect(resume.experience.length).toBeGreaterThan(0)
  })

  it('each experience has required fields', () => {
    resume.experience.forEach((e) => {
      expect(typeof e.company).toBe('string')
      expect(typeof e.role).toBe('string')
      expect(typeof e.period).toBe('string')
      expect(Array.isArray(e.bullets)).toBe(true)
    })
  })
})
