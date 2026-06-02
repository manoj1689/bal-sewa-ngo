'use client'

import { Analytics } from '@vercel/analytics/next'
import { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import { hydrateAuth } from '@/redux/slices/authSlice'
import { store } from '@/redux/store'
import { ThemeProvider } from './theme-provider'

function AuthHydrator({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateAuth())
  }, [])

  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        <ThemeProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </AuthHydrator>
    </Provider>
  )
}
