import { render, screen } from '@testing-library/react'
import About from '@/components/About'

describe('About', () => {
  it('renders the section heading', () => {
    render(<About />)
    expect(screen.getByText('## ./about')).toBeInTheDocument()
  })

  it('renders at least one skill badge', () => {
    render(<About />)
    const badges = screen.getAllByTestId('skill-badge')
    expect(badges.length).toBeGreaterThan(0)
  })
})
