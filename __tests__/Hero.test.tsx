import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the whoami prompt', () => {
    render(<Hero />)
    expect(screen.getByText('$ whoami')).toBeInTheDocument()
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
