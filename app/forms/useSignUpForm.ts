import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { YupSchema } from '~/hooks/useCustomForm'
import { useCustomForm } from '~/hooks/useCustomForm'

export interface SignUpForm {
  email: string
  password: string
}

export const signupValidationSchema = yup.object<YupSchema<SignUpForm>>({
  email: yup.string().email('Email is invalid').required('Email is required').lowercase(),
  password: yup.string().min(8, 'Password is too short').required('Password is required')
})

export const useSignUpForm = () => {
  return useCustomForm<SignUpForm>({
    resolver: yupResolver(signupValidationSchema)
  })
}
