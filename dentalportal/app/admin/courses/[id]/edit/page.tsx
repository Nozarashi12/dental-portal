import pool from '@/lib/db'
import EditForm from './EditForm'

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [[course]] = await pool.query(
    'SELECT * FROM courses WHERE id = ?',
    [id]
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
      <EditForm course={course} />
    </div>
  )
}
