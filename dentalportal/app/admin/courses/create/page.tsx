'use client'

import { useEffect, useState } from 'react'

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    author_description: '',
    cover_image: '',
    overview: '',
    description: '',
    category: '',
    specialty_id: '',
  })

  const [specialties, setSpecialties] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/specialties')
      .then(res => res.json())
      .then(data => setSpecialties(data))
      .catch(err => console.error(err))
  }, [])

  const submit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/admin/courses/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Course Created!')
      window.location.href = '/admin/courses'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>

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
          onChange={(e) => setForm({ ...form, author_description: e.target.value })}
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
          onChange={(e) => setForm({ ...form, specialty_id: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Specialty</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="px-3 py-2 bg-emerald-600 text-white rounded">
          Create
        </button>
      </form>
    </div>
  )
}
