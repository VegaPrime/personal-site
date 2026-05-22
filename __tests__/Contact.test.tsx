import { render, screen } from '@testing-library/react'
import Contact from '@/components/Contact'

describe('Contact', () => {
  it('renders the section heading', () => {
    render(<Contact />)
    expect(screen.getByText('## ./contact')).toBeInTheDocument()
  })

  it('renders email link', () => {
    render(<Contact />)
    const emailLink = screen.getByRole('link', { name: /email/i })
    expect(emailLink.getAttribute('href')).toMatch(/^mailto:/)
  })

  it('renders GitHub link', () => {
    render(<Contact />)
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink.getAttribute('href')).toMatch(/github\.com/)
  })

  it('renders LinkedIn link', () => {
    render(<Contact />)
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink.getAttribute('href')).toMatch(/linkedin\.com/)
  })
})
