import pool from '@/lib/db'
import EditForm from './EditForm'

export default async function EditClassroomPage({ params }: any) {
  const [[classroom]] = await pool.query(
    `SELECT * FROM classrooms WHERE id = ?`,
    [params.id]
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Classroom</h1>
      <EditForm classroom={classroom} />
    </div>
  )
}
