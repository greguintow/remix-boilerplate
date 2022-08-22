import { Link } from '@remix-run/react'

const NoteIndexPage = () => {
  return (
    <div>
      No note selected. Select a note on the left, or{' '}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </div>
  )
}

export default NoteIndexPage
