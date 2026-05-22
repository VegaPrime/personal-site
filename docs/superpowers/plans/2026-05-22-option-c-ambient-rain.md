# Option C — Ambient Matrix Rain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a canvas-based ambient matrix rain background to the Hero section without touching any other component or animation.

**Architecture:** A new `'use client'` component (`MatrixRain`) renders a `<canvas>` that fills the Hero section, runs a `requestAnimationFrame` loop, and cleans up on unmount. The existing Hero server component imports it as a child. All browser APIs unavailable in jsdom (canvas, ResizeObserver, matchMedia, rAF) are mocked in `jest.setup.ts` before writing the component.

**Tech Stack:** Next.js 15 static export, React 19, Canvas 2D API, `requestAnimationFrame`, `ResizeObserver`.

---

## File map

| File | Action |
|---|---|
| `jest.setup.ts` | Add mocks for canvas `getContext`, `ResizeObserver`, `window.matchMedia`, `requestAnimationFrame` |
| `components/MatrixRain.tsx` | **Create** — `'use client'` canvas rain component |
| `__tests__/MatrixRain.test.tsx` | **Create** — canvas present, aria-hidden, pointer-events none |
| `components/Hero.tsx` | **Modify** — import `<MatrixRain />`, render as first child inside `<section>` |

---

## Task 1: Create feature branch

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b feat/option-c-ambient-rain
```

Expected: `Switched to a new branch 'feat/option-c-ambient-rain'`

---

## Task 2: Add browser API mocks to jest.setup.ts

**Files:**
- Modify: `jest.setup.ts`

jsdom does not implement canvas, ResizeObserver, matchMedia, or requestAnimationFrame. The MatrixRain component uses all four. Without these mocks, every test file that renders Hero (which imports MatrixRain) will throw.

- [ ] **Step 1: Replace the full contents of `jest.setup.ts` with the following**

```ts
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
```

- [ ] **Step 2: Run the full test suite — all 38 tests must still pass**

```bash
npm test -- --no-coverage
```

Expected: `Tests: 38 passed, 38 total` — the new mocks must not break any existing test.

- [ ] **Step 3: Commit**

```bash
git add jest.setup.ts
git commit -m "test: add jsdom mocks for canvas, ResizeObserver, matchMedia, rAF

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Create MatrixRain component (TDD)

**Files:**
- Create: `__tests__/MatrixRain.test.tsx`
- Create: `components/MatrixRain.tsx`

### 3a — Write failing tests first

- [ ] **Step 1: Create `__tests__/MatrixRain.test.tsx` with the following**

```tsx
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
```

- [ ] **Step 2: Run tests — expect 4 failures**

```bash
npm test -- --testPathPattern="MatrixRain" --no-coverage
```

Expected: `Tests: 4 failed` — component doesn't exist yet.

### 3b — Implement the component

- [ ] **Step 3: Create `components/MatrixRain.tsx` with the following**

```tsx
'use client'

import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツ0123456789ABCDEF<>|{}'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let drops: number[] = []

    function init() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const cols = Math.floor(canvas.width / 16)
      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height)
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.fillStyle = 'rgba(5, 12, 5, 0.13)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '13px monospace'

      for (let i = 0; i < drops.length; i++) {
        const x = i * 16
        const y = drops[i]

        ctx.fillStyle = 'rgba(180, 255, 200, 0.18)'
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y)

        for (let j = 1; j <= 8; j++) {
          ctx.fillStyle = `rgba(0, 255, 120, ${0.07 * (1 - j / 8)})`
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - j * 13)
        }

        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = -65
        }
        drops[i] += 0.9
      }

      animId = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(init)
    observer.observe(canvas.parentElement ?? canvas)

    init()
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    />
  )
}
```

- [ ] **Step 4: Run MatrixRain tests — all 4 must pass**

```bash
npm test -- --testPathPattern="MatrixRain" --no-coverage
```

Expected: `Tests: 4 passed, 4 total`

- [ ] **Step 5: Run full suite — all tests must pass**

```bash
npm test -- --no-coverage
```

Expected: `Tests: 42 passed, 42 total` (38 existing + 4 new)

- [ ] **Step 6: Commit**

```bash
git add components/MatrixRain.tsx __tests__/MatrixRain.test.tsx
git commit -m "feat: add MatrixRain canvas component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Integrate MatrixRain into Hero (TDD)

**Files:**
- Modify: `components/Hero.tsx`
- Verify: `__tests__/Hero.test.tsx` (no changes needed — all 6 existing tests must still pass)

The Hero component is a Server Component. Server Components can import Client Components without adding `'use client'`. No directive change needed.

- [ ] **Step 1: Run the Hero tests first to confirm baseline**

```bash
npm test -- --testPathPattern="Hero" --no-coverage
```

Expected: `Tests: 6 passed, 6 total`

- [ ] **Step 2: Replace the full contents of `components/Hero.tsx` with the following**

```tsx
import MatrixRain from '@/components/MatrixRain'
import { buttonVariants } from '@/components/ui/button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <MatrixRain />
      <div className="relative mx-auto max-w-5xl">

        {/* Line 1: $ whoami — cursor blinks forever */}
        <div className="mb-3 flex items-center font-mono text-sm text-primary">
          <span className="hero-typewriter-prompt">$ whoami</span>
          <span className="hero-cursor-blink" aria-hidden="true" />
        </div>

        {/* Line 2: name — cursor disappears after typing */}
        <div className="mb-3 flex items-baseline text-4xl font-black leading-tight tracking-tight md:text-6xl">
          <span className="hero-typewriter-name">
            Hi, I&apos;m{' '}
            <span className="text-primary">David Templeton</span>.
          </span>
          <span className="hero-cursor-name" aria-hidden="true" />
        </div>

        {/* Line 3: role — cursor disappears after typing */}
        <div className="mb-8 flex items-center font-mono text-sm text-muted-foreground md:text-base">
          <span className="hero-typewriter-role">
            Full-Stack Engineer &amp; UI Craftsman
          </span>
          <span className="hero-cursor-role" aria-hidden="true" />
        </div>

        {/* Buttons: fade in after typing completes */}
        <div className="hero-buttons-fade flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants()}>
            ./view-projects
          </a>
          <a href="/resume.pdf" download className={buttonVariants({ variant: 'outline' })}>
            ./download-resume
          </a>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run Hero tests — all 6 must still pass**

```bash
npm test -- --testPathPattern="Hero" --no-coverage
```

Expected: `Tests: 6 passed, 6 total`

- [ ] **Step 4: Run full suite — all 42 tests must pass**

```bash
npm test -- --no-coverage
```

Expected: `Tests: 42 passed, 42 total`

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: integrate MatrixRain canvas into Hero section

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Build verification

- [ ] **Step 1: Run the production build**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with `Export successful`, no TypeScript errors.

---

## Task 6: Push branch and open PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin feat/option-c-ambient-rain
```

- [ ] **Step 2: Open pull request**

```bash
gh pr create \
  --title "feat: Option C — ambient matrix rain background on Hero" \
  --body "$(cat <<'EOF'
## Summary
- Adds a canvas-based ambient matrix rain to the Hero section background
- Rain is contained to the Hero section (clipped by existing `overflow-hidden`), fades out at the bottom via CSS mask-image
- ~7% opacity — atmospheric, not distracting; typewriter animation from Option B is untouched
- Respects `prefers-reduced-motion`: animation loop does not start if enabled
- Cleans up `requestAnimationFrame` and `ResizeObserver` on unmount

## Files changed
- `jest.setup.ts` — add jsdom mocks for canvas, ResizeObserver, matchMedia, rAF
- `components/MatrixRain.tsx` — new `'use client'` canvas component
- `components/Hero.tsx` — import and render `<MatrixRain />` as first child

## Test plan
- [ ] CI passes (42 tests, 0 failures)
- [ ] Hero loads with rain visible behind the typewriter text
- [ ] Rain is contained to the Hero section — no rain below the fold
- [ ] Rain fades out at the bottom of the Hero before the next section
- [ ] Typewriter animation plays as before (no regression)
- [ ] Resize browser window — rain canvas resizes correctly
- [ ] Dark and light mode both work
EOF
)"
```
