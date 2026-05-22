import '@testing-library/jest-dom'

// IntersectionObserver is not implemented in jsdom
const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))
window.IntersectionObserver = mockIntersectionObserver
