import { render, screen } from '@testing-library/react'
import { FadeIn } from '@/components/FadeIn'
import { useInView } from '@/hooks/useInView'

jest.mock('@/hooks/useInView')
const mockUseInView = useInView as jest.MockedFunction<typeof useInView>

const stubRef = { current: null } as React.RefObject<HTMLDivElement | null>

describe('FadeIn', () => {
  it('renders children', () => {
    mockUseInView.mockReturnValue([stubRef, false])
    render(<FadeIn><span>hello</span></FadeIn>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('has opacity-0 class when not in view', () => {
    mockUseInView.mockReturnValue([stubRef, false])
    const { container } = render(<FadeIn>content</FadeIn>)
    expect(container.firstChild).toHaveClass('opacity-0')
  })

  it('has opacity-100 class when in view', () => {
    mockUseInView.mockReturnValue([stubRef, true])
    const { container } = render(<FadeIn>content</FadeIn>)
    expect(container.firstChild).toHaveClass('opacity-100')
  })

  it('applies transitionDelay style when delay prop is provided', () => {
    mockUseInView.mockReturnValue([stubRef, false])
    const { container } = render(<FadeIn delay={200}>content</FadeIn>)
    expect(container.firstChild).toHaveStyle({ transitionDelay: '200ms' })
  })

  it('passes className through to wrapper div', () => {
    mockUseInView.mockReturnValue([stubRef, false])
    const { container } = render(<FadeIn className="mt-4">content</FadeIn>)
    expect(container.firstChild).toHaveClass('mt-4')
  })
})
