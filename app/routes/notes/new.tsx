import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { LoadingButton } from '@mui/lab'
import { createNote } from '~/models/note.server'
import { requireUserId } from '~/session.server'
import type { CreateNoteForm } from '~/forms/useCreateNoteForm'
import { FormInput } from '~/components/FormInput'
import type { ErrorResponse } from '~/hooks/useCustomForm'
import { validateSchema } from '~/hooks/useCustomForm'
import { useCreateNoteForm, createNoteValidationSchema } from '~/forms/useCreateNoteForm'

interface ActionData extends ErrorResponse<CreateNoteForm> {}

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
  const [{ isSubmitDisabled, isLoading }, { getInputProps, onSubmit }] = useCreateNoteForm({
    errorResponse: actionData
  })

  return (
    <Form method="post" noValidate className="flex w-full flex-col gap-4" onSubmit={onSubmit()}>
      <FormInput id="title" label="Title:" {...getInputProps('title')} />
      <FormInput id="body" label="Body:" {...getInputProps('body')} />

      <div className="text-right">
        <LoadingButton
          loading={isLoading}
          type="submit"
          disabled={isSubmitDisabled}
          disableElevation
          variant="contained"
          className="w-[100px]"
        >
          Save
        </LoadingButton>
      </div>
    </Form>
  )
}

export default NewNotePage
