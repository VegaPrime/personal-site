'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: './about', href: '#about' },
  { label: './projects', href: '#projects' },
  { label: './resume', href: '#resume' },
  { label: './contact', href: '#contact' },
]

export default function Nav() {
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
        </div>

        {/* Mobile: Sheet */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
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
