import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

describe('Nav', () => {
  it('renders the site name', () => {
    render(<Nav />)
    expect(screen.getByText('~/portfolio')).toBeInTheDocument()
  })

  it('renders all section links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', '#resume')
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
  })
})
