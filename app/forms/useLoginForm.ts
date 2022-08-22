import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { YupSchema } from '~/hooks/useCustomForm'
import { useCustomForm } from '~/hooks/useCustomForm'

export interface LoginForm {
  email: string
  password: string
}

export const loginValidationSchema = yup.object<YupSchema<LoginForm>>({
  email: yup.string().email('Email is invalid').required('Email is required').lowercase(),
  password: yup.string().min(8, 'Password is too short').required('Password is required')
})

export const useLoginForm = () => {
  return useCustomForm<LoginForm>({
    resolver: yupResolver(loginValidationSchema)
  })
}
