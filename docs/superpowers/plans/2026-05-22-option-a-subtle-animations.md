# Option A — Subtle & Polished Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll-triggered fade-in animations, staggered reveals, and card hover lifts across the personal site with zero new npm dependencies.

**Architecture:** A `useInView` hook wraps `IntersectionObserver` (fires once per element). A `FadeIn` wrapper component consumes the hook and toggles Tailwind opacity/translate classes. Hero uses a `mounted` state instead of IntersectionObserver since it is always above the fold. All section `<section id="...">` elements stay unwrapped so nav anchor links keep working.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS v4, `IntersectionObserver` (native browser API)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `hooks/useInView.ts` | IntersectionObserver logic, returns `[ref, inView]` |
| Create | `components/FadeIn.tsx` | Wrapper that toggles opacity/translate via `useInView` |
| Create | `__tests__/useInView.test.ts` | Unit tests for the hook |
| Create | `__tests__/FadeIn.test.tsx` | Unit tests for the wrapper |
| Modify | `components/Hero.tsx` | Add `'use client'`, mounted-state stagger |
| Modify | `components/About.tsx` | Wrap inner div + stagger badges |
| Modify | `components/Projects.tsx` | Wrap inner div + stagger cards + hover lift |
| Modify | `components/Resume.tsx` | Wrap inner div |
| Modify | `components/Contact.tsx` | Wrap inner div |

---

## Task 0: Create feature branch

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout main && git pull && git checkout -b feat/option-a-subtle-animations
```

---

## Task 1: `useInView` hook

**Files:**
- Create: `hooks/useInView.ts`
- Create: `__tests__/useInView.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/useInView.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useInView } from '@/hooks/useInView'

let observerCallback: IntersectionObserverCallback
const observeMock = jest.fn()
const disconnectMock = jest.fn()

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
    const { result } = renderHook(() => useInView())
    const [, inView] = result.current
    expect(inView).toBe(false)
  })

  it('sets inView=true when element intersects', () => {
    const { result } = renderHook(() => useInView())
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    const [, inView] = result.current
    expect(inView).toBe(true)
  })

  it('does not set inView=true when isIntersecting is false', () => {
    const { result } = renderHook(() => useInView())
    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    const [, inView] = result.current
    expect(inView).toBe(false)
  })

  it('disconnects observer after first intersection', () => {
    renderHook(() => useInView())
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- __tests__/useInView.test.ts
```

Expected: `Cannot find module '@/hooks/useInView'`

- [ ] **Step 3: Create `hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- __tests__/useInView.test.ts
```

Expected: 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add hooks/useInView.ts __tests__/useInView.test.ts
git commit -m "feat: add useInView hook with IntersectionObserver"
```

---

## Task 2: `FadeIn` component

**Files:**
- Create: `components/FadeIn.tsx`
- Create: `__tests__/FadeIn.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/FadeIn.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { FadeIn } from '@/components/FadeIn'
import { useInView } from '@/hooks/useInView'

jest.mock('@/hooks/useInView')
const mockUseInView = useInView as jest.MockedFunction<typeof useInView>

const stubRef = { current: null } as React.RefObject<HTMLDivElement>

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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- __tests__/FadeIn.test.tsx
```

Expected: `Cannot find module '@/components/FadeIn'`

- [ ] **Step 3: Create `components/FadeIn.tsx`**

```tsx
'use client'

import { useInView } from '@/hooks/useInView'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- __tests__/FadeIn.test.tsx
```

Expected: 5 tests pass

- [ ] **Step 5: Run full test suite — expect all pass**

```bash
npm test
```

- [ ] **Step 6: Commit**

```bash
git add components/FadeIn.tsx __tests__/FadeIn.test.tsx
git commit -m "feat: add FadeIn wrapper component"
```

---

## Task 3: Hero — mount-state stagger

**Files:**
- Modify: `components/Hero.tsx`

The Hero is always above the fold so it uses `mounted` state instead of `IntersectionObserver`. Add `'use client'`, a `useState`/`useEffect` for `mounted`, and wrap each of the four content blocks in an animation div with staggered `transitionDelay`.

- [ ] **Step 1: Replace `components/Hero.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const animClass = `transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className={animClass} style={{ transitionDelay: '0ms' }}>
          <p className="mb-3 font-mono text-sm text-primary">$ whoami</p>
        </div>
        <div className={animClass} style={{ transitionDelay: '100ms' }}>
          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Hi, I&apos;m{' '}
            <span className="text-primary">David Templeton</span>.
          </h1>
        </div>
        <div className={animClass} style={{ transitionDelay: '200ms' }}>
          <p className="mb-8 font-mono text-sm text-muted-foreground md:text-base">
            Full-Stack Engineer &amp; UI Craftsman
          </p>
        </div>
        <div className={animClass} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className={buttonVariants()}>
              ./view-projects
            </a>
            <a href="/resume.pdf" download className={buttonVariants({ variant: 'outline' })}>
              ./download-resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run Hero tests — expect PASS**

```bash
npm test -- __tests__/Hero.test.tsx
```

Expected: 3 tests pass (existing tests still find the same text and links)

- [ ] **Step 3: Run full test suite**

```bash
npm test
```

Expected: all pass

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add mount-state stagger animation to Hero"
```

---

## Task 4: About — scroll fade-in + staggered badges

**Files:**
- Modify: `components/About.tsx`

Wrap the inner `<div className="mx-auto max-w-5xl">` in `<FadeIn>`. Wrap each `<Badge>` in `<FadeIn delay={index * 60}>`.

- [ ] **Step 1: Update `components/About.tsx`**

```tsx
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/FadeIn'

const skills = [
  'TypeScript', 'React', 'Next.js', 'Node.js',
  'Go', 'PostgreSQL', 'Redis', 'Docker',
  'AWS', 'Tailwind CSS', 'GraphQL', 'Git',
]

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./about</p>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About me</h2>
              <p className="leading-relaxed text-muted-foreground">
                Senior Frontend Engineer with 8+ years building high-traffic,
                customer-facing web applications using React, Next.js, TypeScript,
                and Node. Experienced delivering enterprise and ecommerce platforms
                including Home Depot, NCR, Deloitte, and Honeywell. Focused on
                performance, scalability, accessibility, and measurable business
                impact including conversion, engagement, and page performance.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Strong collaborator who translates product goals into scalable
                frontend architecture, mentors engineers, and drives modern
                engineering practices.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <FadeIn key={skill} delay={index * 60}>
                    <Badge variant="outline" data-testid="skill-badge">
                      {skill}
                    </Badge>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Run About tests — expect PASS**

```bash
npm test -- __tests__/About.test.tsx
```

Expected: 2 tests pass

- [ ] **Step 3: Commit**

```bash
git add components/About.tsx
git commit -m "feat: add scroll fade-in and staggered badges to About"
```

---

## Task 5: Projects — scroll fade-in + staggered cards + hover lift

**Files:**
- Modify: `components/Projects.tsx`

Wrap the inner `<div className="mx-auto max-w-5xl">` in `<FadeIn>`. Wrap each `<Card>` in `<FadeIn delay={index * 100}>` (featured) and `<FadeIn delay={index * 80}>` (secondary). Add hover lift classes to each `<Card>`.

- [ ] **Step 1: Update `components/Projects.tsx`**

```tsx
import { projects } from '@/data/projects'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { GitFork, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/FadeIn'

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./projects</p>
          <h2 className="mb-10 text-2xl font-bold">Projects</h2>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {featured.map((project, index) => (
              <FadeIn key={project.title} delay={index * 100}>
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="font-mono text-sm text-primary">
                      ■ {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="font-mono text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                        >
                          <GitFork className="mr-1 h-3 w-3" /> GitHub
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" /> Live
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {rest.map((project, index) => (
                <FadeIn key={project.title} delay={index * 80}>
                  <Card className="bg-card/30 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-mono text-xs text-primary">
                        ■ {project.title}
                      </CardTitle>
                      <CardDescription className="text-xs">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="font-mono text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2 px-0')}
                        >
                          <GitFork className="mr-1 h-3 w-3" /> GitHub
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Run Projects tests — expect PASS**

```bash
npm test -- __tests__/Projects.test.tsx
```

Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat: add scroll fade-in, card stagger, and hover lift to Projects"
```

---

## Task 6: Resume — scroll fade-in

**Files:**
- Modify: `components/Resume.tsx`

Add `FadeIn` import, wrap the inner `<div className="mx-auto max-w-5xl">` only. The `<section id="resume">` stays untouched.

- [ ] **Step 1: Update `components/Resume.tsx`**

Add the import at the top:
```tsx
import { FadeIn } from '@/components/FadeIn'
```

Wrap the inner div:
```tsx
    <section id="resume" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          {/* ...all existing content unchanged... */}
        </div>
      </FadeIn>
    </section>
```

The full updated file:

```tsx
import { resume } from '@/data/resume'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import { FadeIn } from '@/components/FadeIn'

export default function Resume() {
  return (
    <section id="resume" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./resume</p>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">Resume</h2>
            <a href="/resume.pdf" download className={buttonVariants({ size: 'sm' })}>
              <Download className="mr-1 h-3 w-3" /> Download PDF
            </a>
            {resume.hasDocx && (
              <a href="/resume.docx" download className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Download className="mr-1 h-3 w-3" /> Download Word
              </a>
            )}
          </div>

          <iframe
            src="/resume.pdf"
            className="mb-12 h-150 w-full rounded-lg border border-border"
            title="Resume PDF"
          />

          <h3 className="mb-6 text-lg font-semibold">Experience</h3>
          <div className="space-y-8">
            {resume.experience.map((exp, i) => (
              <div key={exp.company}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold">{exp.company}</span>
                  <span className="font-mono text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="mb-3 text-sm text-primary">{exp.role}</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1 text-primary">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {i < resume.experience.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}
          </div>

          {resume.education.length > 0 && (
            <>
              <Separator className="my-8" />
              <h3 className="mb-6 text-lg font-semibold">Education</h3>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.school} className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="font-semibold">{edu.school}</span>
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{edu.year}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Run Resume tests — expect PASS**

```bash
npm test -- __tests__/Resume.test.tsx
```

Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add components/Resume.tsx
git commit -m "feat: add scroll fade-in to Resume"
```

---

## Task 7: Contact — scroll fade-in

**Files:**
- Modify: `components/Contact.tsx`

- [ ] **Step 1: Update `components/Contact.tsx`**

```tsx
import { buttonVariants } from '@/components/ui/button'
import { Mail, GitFork, Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/FadeIn'

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./contact</p>
          <h2 className="mb-4 text-2xl font-bold">Get in touch</h2>
          <p className="mb-10 max-w-md text-muted-foreground">
            I&apos;m open to new opportunities and interesting projects. My inbox is
            always open.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:d.j.templeton7@gmail.com" aria-label="Email" className={buttonVariants()}>
              <Mail className="mr-2 h-4 w-4" /> Email me
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <GitFork className="mr-2 h-4 w-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/templetondavid/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <Link className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Run Contact tests — expect PASS**

```bash
npm test -- __tests__/Contact.test.tsx
```

Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat: add scroll fade-in to Contact"
```

---

## Task 8: Final verification + PR

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: clean build, no errors

- [ ] **Step 4: Run dev server and manually verify**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Hero elements fade up sequentially on load (no scroll needed)
- Scrolling to About: section fades up, badges stagger in
- Scrolling to Projects: cards cascade in, hover lifts each card
- Scrolling to Resume: section fades up
- Scrolling to Contact: section fades up
- Scroll back up then down again: no re-animation

- [ ] **Step 5: Push branch and open PR**

```bash
git push -u origin feat/option-a-subtle-animations
gh pr create \
  --title "feat: Option A — subtle & polished scroll animations" \
  --body "Adds scroll-triggered fade-ins, staggered reveals, and card hover lifts. Zero new npm dependencies. Closes #option-a"
```
