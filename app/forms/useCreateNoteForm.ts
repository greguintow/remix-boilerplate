import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { YupSchema } from '~/hooks/useCustomForm'
import { useCustomForm } from '~/hooks/useCustomForm'

export interface CreateNoteForm {
  title: string
  body: string
}

export const createNoteValidationSchema = yup.object<YupSchema<CreateNoteForm>>({
  title: yup.string().required('Title is required'),
  body: yup.string().required('Body is required')
})

export const useCreateNoteForm = () => {
  return useCustomForm<CreateNoteForm>({
    resolver: yupResolver(createNoteValidationSchema)
  })
}
