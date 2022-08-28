import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'
import { CacheProvider } from '@emotion/react'
import { AppWrapper } from './AppWrapper'
import { createEmotionCache } from './utils'
import type { ClientStyleContextData } from './contexts'
import { ClientStyleContext } from './contexts'

interface ClientCacheProviderProps {
  children: React.ReactNode
}
export const ClientCacheProvider = ({ children }: ClientCacheProviderProps) => {
  const [cache, setCache] = React.useState(createEmotionCache())

  const reset = React.useCallback(() => {
    setCache(createEmotionCache())
  }, [])

  const clientStyleContext = React.useMemo(
    (): ClientStyleContextData => ({
      reset
    }),
    [reset]
  )

  return (
    <ClientStyleContext.Provider value={clientStyleContext}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <ClientCacheProvider>
          <AppWrapper>
            <RemixBrowser />
          </AppWrapper>
        </ClientCacheProvider>
      </React.StrictMode>
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
