'use client'
import { useState, useEffect } from 'react'

export default function CreateClassroomPage() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({
    title: '',
    speaker: '',
    course_id: '',
    video_url: '',
    description: '',
    author_description: '',
    learning_objectives: '',
    published_date: '',
    expiration_date: '',
    discussion_enabled: true,
    assessment_link: '',
  })

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(setCourses)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/admin/classrooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) alert('Classroom Created!')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Classroom</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border p-2 rounded" />
        <input placeholder="Speaker" value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} className="w-full border p-2 rounded" />

        <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="w-full border p-2 rounded">
          <option value="">Select Course</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <input placeholder="Video URL" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className="w-full border p-2 rounded" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" />
        <textarea placeholder="Author Description" value={form.author_description} onChange={e => setForm({ ...form, author_description: e.target.value })} className="w-full border p-2 rounded" />
        <textarea placeholder="Learning Objectives" value={form.learning_objectives} onChange={e => setForm({ ...form, learning_objectives: e.target.value })} className="w-full border p-2 rounded" />
        <input type="datetime-local" value={form.published_date} onChange={e => setForm({ ...form, published_date: e.target.value })} className="w-full border p-2 rounded" />
        <input type="datetime-local" value={form.expiration_date} onChange={e => setForm({ ...form, expiration_date: e.target.value })} className="w-full border p-2 rounded" />

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={form.discussion_enabled} onChange={e => setForm({ ...form, discussion_enabled: e.target.checked })} />
          <span>Enable Discussion</span>
        </label>

        <input placeholder="Assessment Link" value={form.assessment_link} onChange={e => setForm({ ...form, assessment_link: e.target.value })} className="w-full border p-2 rounded" />

        <button type="submit" className="px-3 py-2 bg-emerald-600 text-white rounded">Create</button>
      </form>
    </div>
  )
}
