import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the whoami prompt text', () => {
    render(<Hero />)
    expect(screen.getByText('$ whoami')).toBeInTheDocument()
  })

  it('renders the whoami cursor with hero-cursor-blink class', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('.hero-cursor-blink')).toBeInTheDocument()
  })

  it('renders name text with hero-typewriter-name class', () => {
    const { container } = render(<Hero />)
    const nameSpan = container.querySelector('.hero-typewriter-name')
    expect(nameSpan).toBeInTheDocument()
    expect(nameSpan?.textContent).toContain("Hi, I'm")
    expect(nameSpan?.textContent).toContain('David Templeton')
  })

  it('renders role text with hero-typewriter-role class', () => {
    const { container } = render(<Hero />)
    const roleSpan = container.querySelector('.hero-typewriter-role')
    expect(roleSpan).toBeInTheDocument()
    expect(roleSpan?.textContent).toContain('Full-Stack Engineer')
  })

  it('renders view projects button linking to #projects', () => {
    render(<Hero />)
    const btn = screen.getByRole('link', { name: /view-projects/i })
    expect(btn).toHaveAttribute('href', '#projects')
  })

  it('renders download resume button linking to resume pdf', () => {
    render(<Hero />)
    const btn = screen.getByRole('link', { name: /download-resume/i })
    expect(btn).toHaveAttribute('href', '/resume.pdf')
  })
})
