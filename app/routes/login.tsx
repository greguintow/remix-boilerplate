import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { Button } from '@mui/material'
import { createUserSession, getUserId } from '~/session.server'
import { verifyLogin } from '~/models/user.server'
import { safeRedirect } from '~/utils'
import type { ErrorResponse } from '~/hooks/useCustomForm'
import { validateSchema } from '~/hooks/useCustomForm'
import type { LoginForm } from '~/forms/useLoginForm'
import { useLoginForm, loginValidationSchema } from '~/forms/useLoginForm'
import { FormInput } from '~/components/FormInput'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

interface ActionData extends ErrorResponse<LoginForm> {}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const remember = formData.get('remember')

  const input: LoginForm = {
    email,
    password
  }

  const { data, errorResponse } = await validateSchema(loginValidationSchema, input)

  if (errorResponse) {
    return errorResponse
  }

  const user = await verifyLogin(data!.email, data!.password)

  if (!user) {
    return json<ActionData>(
      {
        errors: {
          email: {
            message: 'Invalid email or password',
            value: email
          }
        },
        input: {
          email
        }
      },
      { status: 400 }
    )
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on',
    redirectTo
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Login'
  }
}

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const actionData = useActionData() as ActionData
  const [{ isSubmitDisabled }, { getInputProps, onSubmit }] = useLoginForm({
    errorResponse: actionData
  })
  const redirectTo = searchParams.get('redirectTo') || '/notes'

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6" onSubmit={onSubmit()}>
          <FormInput
            label="Email address"
            id="email"
            type="email"
            autoComplete="email"
            {...getInputProps('email')}
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            autoComplete="current-password"
            inputProps={{
              minLength: 8
            }}
            {...getInputProps('password')}
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button
            fullWidth
            type="submit"
            disabled={isSubmitDisabled}
            disableElevation
            variant="contained"
          >
            Log In
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&#39;t have an account?&nbsp;
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/join',
                  search: searchParams.toString()
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
