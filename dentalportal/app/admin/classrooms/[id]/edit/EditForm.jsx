'use client'

import { useState } from 'react'

export default function EditForm({ classroom }) {
  const [form, setForm] = useState(classroom)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetch(`/api/admin/classrooms/${classroom.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    alert('Updated!')
    window.location.href = '/admin/classrooms'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        className="w-full border p-2 rounded"
        defaultValue={classroom.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded"
        defaultValue={classroom.speaker}
        onChange={(e) => setForm({ ...form, speaker: e.target.value })}
      />

      <textarea
        className="w-full border p-2 rounded"
        defaultValue={classroom.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <textarea
        className="w-full border p-2 rounded"
        defaultValue={classroom.author_description}
        onChange={(e) =>
          setForm({ ...form, author_description: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        defaultValue={classroom.course_id}
        onChange={(e) => setForm({ ...form, course_id: e.target.value })}
      />

      <button className="px-3 py-2 bg-blue-600 text-white rounded">
        Save Changes
      </button>
    </form>
  )
}
