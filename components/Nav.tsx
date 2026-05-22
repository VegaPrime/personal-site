'use client'

import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Sun, Moon } from 'lucide-react'

const links = [
  { label: './about', href: '#about' },
  { label: './projects', href: '#projects' },
  { label: './resume', href: '#resume' },
  { label: './contact', href: '#contact' },
]

export default function Nav() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <span className="font-mono text-sm font-bold text-primary">~/portfolio</span>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        {/* Mobile: Sheet */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-56">
              <div className="mt-8 flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-mono text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
