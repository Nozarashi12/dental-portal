'use client'

import { useState, useEffect } from 'react'

interface Classroom {
  id: number
  title: string
  speaker: string
  course_id: string
  video_url: string
  description: string
  author_description: string
  learning_objectives: string
  published_date: string | null
  expiration_date: string | null
  discussion_enabled: boolean
  assessment_link: string
}

interface EditClassroomFormProps {
  classroom: Classroom
}

export default function EditClassroomForm({ classroom }: EditClassroomFormProps) {
  const [courses, setCourses] = useState<any[]>([])
  const [form, setForm] = useState({
    title: classroom.title || '',
    speaker: classroom.speaker || '',
    course_id: classroom.course_id || '',
    video_url: classroom.video_url || '',
    description: classroom.description || '',
    author_description: classroom.author_description || '',
    learning_objectives: classroom.learning_objectives || '',
    published_date: classroom.published_date
      ? new Date(classroom.published_date).toISOString().slice(0, 16)
      : '',
    expiration_date: classroom.expiration_date
      ? new Date(classroom.expiration_date).toISOString().slice(0, 16)
      : '',
    discussion_enabled: classroom.discussion_enabled ?? true,
    assessment_link: classroom.assessment_link || '',
  })

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(setCourses)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch(`/api/admin/classrooms/${classroom.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Classroom Updated!')
    } else {
      const errorText = await res.text()
      alert('Update Failed: ' + errorText)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Speaker"
        value={form.speaker}
        onChange={e => setForm({ ...form, speaker: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <select
        value={form.course_id}
        onChange={e => setForm({ ...form, course_id: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <input
        placeholder="Video URL"
        value={form.video_url}
        onChange={e => setForm({ ...form, video_url: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Author Description"
        value={form.author_description}
        onChange={e => setForm({ ...form, author_description: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Learning Objectives"
        value={form.learning_objectives}
        onChange={e => setForm({ ...form, learning_objectives: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="datetime-local"
        value={form.published_date}
        onChange={e => setForm({ ...form, published_date: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="datetime-local"
        value={form.expiration_date}
        onChange={e => setForm({ ...form, expiration_date: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.discussion_enabled}
          onChange={e => setForm({ ...form, discussion_enabled: e.target.checked })}
        />
        <span>Enable Discussion</span>
      </label>

      <input
        placeholder="Assessment Link"
        value={form.assessment_link}
        onChange={e => setForm({ ...form, assessment_link: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="px-3 py-2 bg-emerald-600 text-white rounded">
        Update
      </button>
    </form>
  )
}
