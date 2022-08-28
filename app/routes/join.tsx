import * as React from 'react'
import { Button } from '@mui/material'
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'

import { getUserId, createUserSession } from '~/session.server'

import { createUser, getUserByEmail } from '~/models/user.server'
import { safeRedirect } from '~/utils'
import type { SignUpForm } from '~/forms/useSignUpForm'
import { useSignUpForm, signUpValidationSchema } from '~/forms/useSignUpForm'
import type { ErrorResponse } from '~/hooks/useCustomForm'
import { validateSchema } from '~/hooks/useCustomForm'
import { FormInput } from '~/components/FormInput'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

interface ActionData extends ErrorResponse<SignUpForm> {}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

  const input: SignUpForm = {
    email,
    password
  }

  const { data, errorResponse } = await validateSchema(signUpValidationSchema, input)

  if (errorResponse) {
    return errorResponse
  }

  const existingUser = await getUserByEmail(data!.email)
  if (existingUser) {
    return json<ActionData>(
      {
        errors: {
          email: {
            message: 'A user already exists with this email',
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

  const user = await createUser(data!.email, data!.password)

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up'
  }
}

const Join = () => {
  const [searchParams] = useSearchParams()
  const actionData = useActionData() as ActionData
  const [{ isSubmitDisabled }, { getInputProps, onSubmit }] = useSignUpForm({
    errorResponse: actionData
  })
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6" onSubmit={onSubmit()} noValidate>
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
            autoComplete="new-password"
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
            Create Account
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/login',
                  search: searchParams.toString()
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Join
