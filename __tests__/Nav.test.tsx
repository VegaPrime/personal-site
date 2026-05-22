import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}))

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

  it('renders the theme toggle button', () => {
    render(<Nav />)
    const toggleButtons = screen.getAllByRole('button', { name: /toggle theme/i })
    expect(toggleButtons.length).toBeGreaterThan(0)
  })
})
