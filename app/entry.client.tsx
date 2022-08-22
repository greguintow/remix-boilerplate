import type * as React from 'react'
import { useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from 'remix'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createEmotionCache } from './utils'
import { ClientStyleContext } from './contexts'
import { materialTheme } from './theme'

interface ClientCacheProviderProps {
  children: React.ReactNode
}
const ClientCacheProvider = ({ children }: ClientCacheProviderProps) => {
  const [cache, setCache] = useState(createEmotionCache())

  function reset() {
    setCache(createEmotionCache())
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <ThemeProvider theme={materialTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </ClientCacheProvider>
)
