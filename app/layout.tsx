import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { isAdminSession } from '@/actions/auth'
import { Navigation } from '@/components/Navigation'
import { RealtimeStatusMonitor } from '@/components/RealtimeStatusMonitor'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'PES Tournament', template: '%s | PES Tournament' },
  description: 'PES Tournament tracker',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isAdminSession()

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-bg text-text antialiased">
        <div className="flex min-h-dvh">
          <Navigation isAdmin={isAdmin} />
          {/* pt-12 accommodates mobile top header; pb-20 for mobile bottom nav */}
          <main className="flex-1 min-w-0 pt-12 md:pt-0 pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <RealtimeStatusMonitor />
      </body>
    </html>
  )
}
