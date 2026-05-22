import { render, act } from '@testing-library/react'
import { useInView } from '@/hooks/useInView'

let observerCallback: IntersectionObserverCallback
const observeMock = jest.fn()
const disconnectMock = jest.fn()

function TestComponent({ onChange }: { onChange: (inView: boolean) => void }) {
  const [ref, inView] = useInView()
  onChange(inView)
  return <div ref={ref} data-testid="target" />
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(window as unknown as Record<string, unknown>).IntersectionObserver = jest.fn(
    (cb: IntersectionObserverCallback) => {
      observerCallback = cb
      return { observe: observeMock, disconnect: disconnectMock }
    }
  )
})

describe('useInView', () => {
  it('returns inView=false initially', () => {
    const onChange = jest.fn()
    render(<TestComponent onChange={onChange} />)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('sets inView=true when element intersects', () => {
    const onChange = jest.fn()
    render(<TestComponent onChange={onChange} />)
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(onChange).toHaveBeenLastCalledWith(true)
  })

  it('does not set inView=true when isIntersecting is false', () => {
    const onChange = jest.fn()
    render(<TestComponent onChange={onChange} />)
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('disconnects observer after first intersection', () => {
    const onChange = jest.fn()
    render(<TestComponent onChange={onChange} />)
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})
