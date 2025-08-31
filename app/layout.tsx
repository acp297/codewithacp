import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/navigation/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeWithACP - Learn Programming & Tech Skills',
  description: 'Master programming, web development, and tech skills with our comprehensive courses, articles, and video tutorials.',
  keywords: 'programming, coding, web development, tech courses, online learning',
  authors: [{ name: 'ACP' }],
  creator: 'ACP',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codewithacp.com',
    title: 'CodeWithACP - Learn Programming & Tech Skills',
    description: 'Master programming, web development, and tech skills with our comprehensive courses, articles, and video tutorials.',
    siteName: 'CodeWithACP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeWithACP - Learn Programming & Tech Skills',
    description: 'Master programming, web development, and tech skills with our comprehensive courses, articles, and video tutorials.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
