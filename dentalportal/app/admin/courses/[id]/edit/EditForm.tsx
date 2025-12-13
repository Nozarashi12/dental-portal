'use client'

import { useEffect, useState } from 'react'

type Specialty = {
  id: number
  name: string
}

type CourseForm = {
  title: string
  author: string
  author_description: string
  cover_image: string
  overview: string
  description: string
  category: string
  specialty_id: string | number | null
}

export default function EditForm({ course }: { course: any }) {
  const [form, setForm] = useState<CourseForm>({
    title: course.title || '',
    author: course.author || '',
    author_description: course.author_description || '',
    cover_image: course.cover_image || '',
    overview: course.overview || '',
    description: course.description || '',
    category: course.category || '',
    specialty_id: course.specialty_id || '',
  })

  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/specialties')
      .then(res => res.json())
      .then(data => setSpecialties(data))
      .catch(console.error)
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        specialty_id: form.specialty_id || null,
      }),
    })

    setLoading(false)

    if (res.ok) {
      alert('Course Updated!')
      window.location.href = '/admin/courses'
    } else {
      alert('Failed to update course')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      <form onSubmit={submit} className="space-y-4 max-w-xl">

        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Author Description"
          value={form.author_description}
          onChange={(e) =>
            setForm({ ...form, author_description: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Cover Image URL"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Overview"
          value={form.overview}
          onChange={(e) => setForm({ ...form, overview: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <select
          value={form.specialty_id || ''}
          onChange={(e) =>
            setForm({ ...form, specialty_id: e.target.value || null })
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Specialty</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
