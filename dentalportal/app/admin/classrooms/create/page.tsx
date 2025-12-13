'use client'

import { useState } from 'react'

export default function CreateClassroomPage() {
  const [form, setForm] = useState({
    title: '',
    speaker: '',
    description: '',
    author_description: '',
    course_id: '',
    video_url: '',
    learning_objectives: '',
    published_date: '',
    expiration_date: '',
    discussion_enabled: true,
    assessment_link: ''
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/admin/classrooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      alert('Classroom Created!')
      window.location.href = '/admin/classrooms'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Classroom</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {Object.keys(form).map((key) => {
          if (key === 'discussion_enabled') {
            return (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.discussion_enabled}
                  onChange={(e) =>
                    setForm({ ...form, discussion_enabled: e.target.checked })
                  }
                />
                <span>Enable Discussion</span>
              </label>
            )
          } else if (['description', 'author_description', 'learning_objectives'].includes(key)) {
            return (
              <textarea
                key={key}
                className="w-full border p-2 rounded"
                placeholder={key.replace('_', ' ')}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            )
          } else {
            return (
              <input
                key={key}
                className="w-full border p-2 rounded"
                placeholder={key.replace('_', ' ')}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            )
          }
        })}

        <button className="px-3 py-2 bg-emerald-600 text-white rounded">
          Create
        </button>
      </form>
    </div>
  )
}
