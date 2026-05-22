import { render } from '@testing-library/react'
import MatrixRain from '@/components/MatrixRain'

describe('MatrixRain', () => {
  it('renders a canvas element', () => {
    const { container } = render(<MatrixRain />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('canvas has aria-hidden true', () => {
    const { container } = render(<MatrixRain />)
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  it('canvas has pointer-events none', () => {
    const { container } = render(<MatrixRain />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.style.pointerEvents).toBe('none')
  })

  it('canvas is absolutely positioned filling parent', () => {
    const { container } = render(<MatrixRain />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.style.position).toBe('absolute')
    expect(canvas.style.width).toBe('100%')
    expect(canvas.style.height).toBe('100%')
  })
})
