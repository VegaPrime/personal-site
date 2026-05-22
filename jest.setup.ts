import '@testing-library/jest-dom'

// IntersectionObserver is not implemented in jsdom
const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))
window.IntersectionObserver = mockIntersectionObserver

// ResizeObserver is not implemented in jsdom
const mockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))
window.ResizeObserver = mockResizeObserver

// Canvas 2D context is not implemented in jsdom
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(HTMLCanvasElement.prototype as any).getContext = jest.fn().mockReturnValue({
  fillStyle: '',
  font: '',
  fillRect: jest.fn(),
  fillText: jest.fn(),
})

// window.matchMedia is not implemented in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// requestAnimationFrame / cancelAnimationFrame are not reliably available in jsdom
window.requestAnimationFrame = jest.fn().mockReturnValue(1)
window.cancelAnimationFrame = jest.fn()
