import '@testing-library/jest-dom'
import { screen, setup } from '~/utils/test.util'
import { FormInput } from './FormInput'

describe('FormInput', () => {
  it('should render the input', () => {
    setup(<FormInput label="Email" name="email" type="email" />)

    const input = screen.getByRole('textbox', {
      name: /email/i
    })

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('should change input value', async () => {
    const { user } = setup(<FormInput label="Email" name="email" type="email" />)

    const input = screen.getByRole('textbox', {
      name: /email/i
    })
    const email = 'test@example.com'

    expect(input).toBeInTheDocument()

    await user.type(input, email)
    expect(input).toHaveValue(email)
  })
})
