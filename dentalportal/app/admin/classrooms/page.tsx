import Link from 'next/link'

async function getClassrooms() {
  const res = await fetch('http://localhost:3000/api/admin/classrooms', {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch classrooms')
  return res.json()
}

export default async function ClassroomsPage() {
  const classrooms = await getClassrooms()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Classrooms</h1>
        <Link
          href="/admin/classrooms/create"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Add Classroom
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Speaker</th>
            <th className="p-2 border">Course ID</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((c: any) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{c.title}</td>
              <td className="p-2 border">{c.speaker}</td>
              <td className="p-2 border">{c.course_id}</td>
              <td className="p-2 border">
                <Link
                  href={`/admin/classrooms/${c.id}/edit`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
