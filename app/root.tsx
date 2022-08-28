import * as React from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { ClientStyleContext } from './contexts'
import { materialTheme } from './theme'
import { getUser } from './session.server'
import tailwindStylesheetUrl from './styles/tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Notes',
  viewport: 'width=device-width,initial-scale=1',
  description: 'A simple notes app'
})

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

interface LoaderData {
  user: Awaited<ReturnType<typeof getUser>>
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request)
  })
}
interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const clientStyleData = React.useContext(ClientStyleContext)

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head
    // re-inject tags
    const { tags } = emotionCache.sheet
    emotionCache.sheet.flush()
    tags.forEach(tag => {
      // eslint-disable-next-line no-underscore-dangle
      ;(emotionCache.sheet as any)._insertTag(tag)
    })
    // reset cache to reapply global styles
    clientStyleData.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="emotion-insertion-point" />
        <meta name="theme-color" content={materialTheme.palette.primary.main} />
        <Meta />
        <Links />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
})

const App = () => {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export default App
