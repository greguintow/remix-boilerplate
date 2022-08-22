import { Button } from '@mui/material'
import type { ActionFunction, HeadersFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { createNote } from '~/models/note.server'
import { requireUserId } from '~/session.server'
import type { CreateNoteForm } from '~/forms/useCreateNoteForm'
import { FormInput } from '~/components/FormInput'
import type { ErrorResponse } from '~/hooks/useCustomForm'
import { validateSchema } from '~/hooks/useCustomForm'
import { useCreateNoteForm, createNoteValidationSchema } from '~/forms/useCreateNoteForm'

interface ActionData extends ErrorResponse<CreateNoteForm> {}

export const headers: HeadersFunction = () => {
  return {
    'cache-control': 'max-age=3600'
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const formJson = Object.fromEntries(formData) as unknown as CreateNoteForm

  const { data, errorResponse } = await validateSchema(createNoteValidationSchema, formJson)

  if (errorResponse) {
    return errorResponse
  }

  const note = await createNote({ ...(data as CreateNoteForm), userId })

  return redirect(`/notes/${note.id}`)
}

const NewNotePage = () => {
  const actionData = useActionData() as ActionData
  const [{ isSubmitDisabled }, { getInputProps, onSubmit }] = useCreateNoteForm()

  return (
    <Form method="post" noValidate className="flex w-full flex-col gap-2" onSubmit={onSubmit()}>
      <FormInput
        id="title"
        label="Title:"
        {...getInputProps('title', {
          errorResponse: actionData
        })}
      />

      <FormInput
        id="body"
        label="Body:"
        rows={8}
        multiline
        {...getInputProps('body', { errorResponse: actionData })}
      />

      <div className="text-right">
        <Button type="submit" disabled={isSubmitDisabled} disableElevation variant="contained">
          Save
        </Button>
      </div>
    </Form>
  )
}

export default NewNotePage
