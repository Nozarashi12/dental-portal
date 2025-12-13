import Link from 'next/link'
import pool from '@/lib/db'

export default async function ClassroomsPage() {
  const [rows] = await pool.query(
    `SELECT cl.id, cl.title, cl.speaker, c.title AS course_title 
     FROM classrooms cl 
     JOIN courses c ON cl.course_id = c.id 
     ORDER BY cl.created_at DESC`
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Classrooms</h1>
        <Link
          href="/admin/classrooms/create"
          className="px-3 py-2 bg-emerald-600 text-white rounded"
        >
          New Classroom
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rows.map((cl: any) => (
          <div key={cl.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{cl.title}</h3>
            <p className="text-sm text-gray-500">
              {cl.speaker} • {cl.course_title}
            </p>

            <div className="mt-3 flex space-x-2">
              <Link
                href={`/admin/classrooms/${cl.id}/edit`}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <button
                className="px-3 py-2 bg-red-600 text-white rounded"
                onClick={async () => {
                  if (!confirm('Delete?')) return
                  await fetch(`/api/admin/classrooms/${cl.id}`, {
                    method: 'DELETE',
                  })
                  location.reload()
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
