'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/Button'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/players',   label: 'Players'   },
  { href: '/admin/matches',   label: 'Matches'   },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-surface-raised text-text'
                    : 'text-text-muted hover:text-text hover:bg-surface-raised',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  )
}
