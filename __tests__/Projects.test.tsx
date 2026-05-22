import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects'

jest.mock('@/data/projects', () => ({
  projects: [
    {
      title: 'Test Project',
      description: 'A test project description.',
      stack: ['TypeScript', 'Next.js'],
      github: 'https://github.com/user/test',
      featured: true,
    },
    {
      title: 'Another Project',
      description: 'Another description.',
      stack: ['Go'],
      featured: false,
    },
  ],
}))

describe('Projects', () => {
  it('renders all projects', () => {
    render(<Projects />)
    expect(screen.getByText(/Test Project/)).toBeInTheDocument()
    expect(screen.getByText(/Another Project/)).toBeInTheDocument()
  })

  it('renders stack badges', () => {
    render(<Projects />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
  })

  it('renders github link when provided', () => {
    render(<Projects />)
    const githubLink = screen.getByRole('link', { name: /git/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/user/test')
  })

  it('card wrapper has glitch-card class', () => {
    const { container } = render(<Projects />)
    const glitchCards = container.querySelectorAll('.glitch-card')
    expect(glitchCards.length).toBeGreaterThan(0)
  })

  it('title span has glitch-title class and correct data-text attribute', () => {
    const { container } = render(<Projects />)
    const glitchTitles = container.querySelectorAll('.glitch-title')
    expect(glitchTitles.length).toBeGreaterThan(0)
    // Featured project title
    const featuredTitle = container.querySelector('[data-text="■ Test Project"]')
    expect(featuredTitle).toBeInTheDocument()
    expect(featuredTitle).toHaveClass('glitch-title')
    // Non-featured project title
    const restTitle = container.querySelector('[data-text="■ Another Project"]')
    expect(restTitle).toBeInTheDocument()
    expect(restTitle).toHaveClass('glitch-title')
  })
})
