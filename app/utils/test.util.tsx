import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { AppWrapper } from '~/AppWrapper'

afterEach(() => {
  cleanup()
})

// eslint-disable-next-line no-promise-executor-return
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => <AppWrapper>{children}</AppWrapper>,
    ...options
  })

export const setup = (ui: React.ReactElement, options = {}) => {
  return {
    user: userEvent.setup(),
    element: customRender(ui, options)
  }
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
