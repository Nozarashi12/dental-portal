'use client'

export default function ClassroomTable({ classrooms }: any) {
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this classroom?')) return

    await fetch(`/api/admin/classrooms/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Title</th>
          <th>Course</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {classrooms.map((c: any) => (
          <tr key={c.id}>
            <td>{c.title}</td>
            <td>{c.course_title}</td>
           <td className="space-x-3">
  <a
    href={`/admin/classrooms/${c.id}/edit`}
    className="text-blue-600"
  >
    Edit
  </a>

  <button
    onClick={() => handleDelete(c.id)}
    className="text-red-600"
  >
    Delete
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
