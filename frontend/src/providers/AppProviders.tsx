'use client'

import { Analytics } from '@vercel/analytics/next'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/redux/store'
import { ThemeProvider } from './theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </ThemeProvider>
    </Provider>
  )
}
