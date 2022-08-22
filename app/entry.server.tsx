import { PassThrough } from 'stream'
import { renderToPipeableStream } from 'react-dom/server'
import { RemixServer } from '@remix-run/react'
import { Response } from '@remix-run/node'
import type { EntryContext, Headers } from '@remix-run/node'
import isBot from 'isbot'
import createEmotionServer from '@emotion/server/create-instance'
import { CacheProvider } from '@emotion/react'
import { createEmotionCache } from './utils'
import { AppWrapper } from './AppWrapper'

const ABORT_DELAY = 5000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)
  const callbackName = isBot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  const MuiRemixServer = () => (
    <CacheProvider value={cache}>
      <AppWrapper>
        <RemixServer context={remixContext} url={request.url} />
      </AppWrapper>
    </CacheProvider>
  )

  const response = await new Promise<Response>((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(<MuiRemixServer />, {
      [callbackName]() {
        const body = new PassThrough()

        responseHeaders.set('Content-Type', 'text/html')
        resolve(
          new Response(body, {
            status: didError ? 500 : responseStatusCode,
            headers: responseHeaders
          })
        )
        pipe(body)
      },
      onShellError(err: unknown) {
        reject(err)
      },
      onError(error: unknown) {
        didError = true
        console.error(error)
      }
    })
    setTimeout(abort, ABORT_DELAY)
  })

  const html = await response.text()

  const { styles } = extractCriticalToChunks(html)

  let stylesHTML = ''

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`
    stylesHTML = `${stylesHTML}${newStyleTag}`
  })

  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`
  )

  return new Response(markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}
