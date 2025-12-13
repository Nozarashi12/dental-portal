import EditClassroomForm from '../edit/EditForm'
import db from '@/lib/db'

interface EditClassroomPageProps {
  params: { id: string } | Promise<{ id: string }>
}

async function getClassroom(id: string) {
  const [rows]: any = await db.query('SELECT * FROM classrooms WHERE id = ?', [id])
  if (!rows || rows.length === 0) throw new Error('Classroom not found')
  return rows[0]
}

export default async function EditClassroomPage({ params }: EditClassroomPageProps) {
  // unwrap params if it's a Promise
  const resolvedParams = params instanceof Promise ? await params : params
  const { id } = resolvedParams

  if (!id) throw new Error('Missing classroom ID')

  const classroom = await getClassroom(id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Classroom</h1>
      <EditClassroomForm classroom={classroom} />
    </div>
  )
}
