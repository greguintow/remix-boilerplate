import { Button } from '@mui/material'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { deleteNote, getNote } from '~/models/note.server'
import { requireUserId } from '~/session.server'

interface LoaderData {
  note: NonNullable<Awaited<ReturnType<typeof getNote>>>
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  const note = await getNote({ userId, id: params.noteId })
  if (!note) {
    throw new Response('Not Found', { status: 404 })
  }
  return json<LoaderData>({ note })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  await deleteNote({ userId, id: params.noteId })

  return redirect('/notes')
}

const NoteDetailsPage = () => {
  const data = useLoaderData() as LoaderData

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <Button type="submit" color="error">
          Delete
        </Button>
      </Form>
    </div>
  )
}

export default NoteDetailsPage

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Note not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
