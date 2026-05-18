import { Nunito } from 'next/font/google'

import { AppProviders } from '@/providers/AppProviders'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} ${nunito.variable} antialiased bg-background text-foreground`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
