// app/admin/classrooms/edit/EditForm.tsx (Client Component)
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DoorOpen, BookOpen, User, Video, 
  FileText, Target, Calendar, Clock,
  Link, MessageSquare, Save, ArrowLeft,
  AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react'

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
  assessment_link_2: string // Add this
  assessment_link_3: string // Add this
  google_classroom_link: string
  ce_credit: number
}

interface EditClassroomFormProps {
  classroom: Classroom
}

export default function EditClassroomForm({ classroom }: EditClassroomFormProps) {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  
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
     assessment_link_2: classroom.assessment_link_2 || '', 
  assessment_link_3: classroom.assessment_link_3 || '',
    google_classroom_link: classroom.google_classroom_link || '',
     ce_credit: classroom.ce_credit?.toString() || '',
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setFetching(true)
      const res = await fetch('/api/admin/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setFetching(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.title.trim()) newErrors.title = 'Classroom title is required'
    if (!form.speaker.trim()) newErrors.speaker = 'Speaker name is required'
    if (!form.course_id) newErrors.course_id = 'Course selection is required'
    if (!form.video_url.trim()) newErrors.video_url = 'Video URL is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.learning_objectives.trim()) newErrors.learning_objectives = 'Learning objectives are required'
    if (!form.published_date) newErrors.published_date = 'Published date is required'
    if (!form.ce_credit) newErrors.ce_credit = 'CE Credit is required'

    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const res = await fetch(`/api/admin/classrooms/${classroom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSuccess('Classroom updated successfully!')
        
        // Clear success message after 1.5 seconds and redirect
        setTimeout(() => {
          setSuccess('')
          router.push('/admin/classrooms')
        }, 1500)
      } else {
        const errorText = await res.text()
        setErrors({ submit: 'Update failed: ' + errorText })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/classrooms')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classrooms
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Classroom</h1>
          <p className="text-gray-600 mt-1">Update classroom information and settings</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-emerald-800 font-medium">{success}</div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-red-800 font-medium">{errors.submit}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <DoorOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-600">Update the core details of your classroom</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-4 h-4" />
                        Classroom Title *
                      </div>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter classroom title"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Speaker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Speaker Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.speaker ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter speaker name"
                      value={form.speaker}
                      onChange={(e) => handleChange('speaker', e.target.value)}
                    />
                    {errors.speaker && (
                      <p className="mt-1 text-sm text-red-600">{errors.speaker}</p>
                    )}
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Select Course *
                      </div>
                    </label>
                    <select
                      value={form.course_id}
                      onChange={(e) => handleChange('course_id', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.course_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={fetching}
                    >
                      <option value="">Choose a course...</option>
                      {courses.map((course: any) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.author})
                        </option>
                      ))}
                    </select>
                    {errors.course_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
                    )}
                    {fetching && (
                      <p className="mt-1 text-sm text-gray-500">Loading courses...</p>
                    )}
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video URL *
                      </div>
                    </label>
                    <input
                      type="url"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.video_url ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/video.mp4"
                      value={form.video_url}
                      onChange={(e) => handleChange('video_url', e.target.value)}
                    />
                    {errors.video_url && (
                      <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Classroom Content</h2>
                    <p className="text-sm text-gray-600">Update detailed information about the classroom</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classroom Description *
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[120px] resize-y ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Detailed description of the classroom session"
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Author Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speaker/Author Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[100px] resize-y"
                      placeholder="Background and qualifications of the speaker"
                      value={form.author_description}
                      onChange={(e) => handleChange('author_description', e.target.value)}
                    />
                  </div>

                  {/* Learning Objectives */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Learning Objectives *
                      </div>
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[120px] resize-y ${
                        errors.learning_objectives ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="List the learning objectives for this classroom (one per line)"
                      value={form.learning_objectives}
                      onChange={(e) => handleChange('learning_objectives', e.target.value)}
                    />
                    {errors.learning_objectives && (
                      <p className="mt-1 text-sm text-red-600">{errors.learning_objectives}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule & Features Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Schedule & Features</h2>
                    <p className="text-sm text-gray-600">Update timing and features</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* CE Credit */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <div className="flex items-center gap-2">
      <Target className="w-4 h-4" />
      CE Credit *
    </div>
  </label>
  <input
    type="number"
    step="0.5"
    min="0"
    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
      errors.ce_credit ? 'border-red-300' : 'border-gray-300'
    }`}
    placeholder="e.g. 2.0"
    value={form.ce_credit}
    onChange={(e) => handleChange('ce_credit', e.target.value)}
  />
  {errors.ce_credit && (
    <p className="mt-1 text-sm text-red-600">{errors.ce_credit}</p>
  )}
  <p className="mt-1 text-xs text-gray-500">
    Enter CE credit hours for this classroom
  </p>
</div>

                  {/* Published Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Published Date *
                      </div>
                    </label>
                    <input
                      type="datetime-local"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.published_date ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={form.published_date}
                      onChange={(e) => handleChange('published_date', e.target.value)}
                    />
                    {errors.published_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.published_date}</p>
                    )}
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Expiration Date (Optional)
                      </div>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      value={form.expiration_date}
                      onChange={(e) => handleChange('expiration_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {/* Discussion Enabled */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Enable Discussion</p>
                        <p className="text-sm text-gray-600">Allow students to discuss this classroom</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.discussion_enabled}
                        onChange={(e) => handleChange('discussion_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Google Classroom Link - Only shown when discussion is enabled */}
                  {form.discussion_enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Google Classroom Link (Optional)
                        </div>
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="https://classroom.google.com/..."
                        value={form.google_classroom_link}
                        onChange={(e) => handleChange('google_classroom_link', e.target.value)}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Link to Google Classroom for this session
                      </p>
                    </div>
                  )}

                  {/* Assessment Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Assessment Link (Optional)
                      </div>
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="https://example.com/assessment"
                      value={form.assessment_link}
                      onChange={(e) => handleChange('assessment_link', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Assessment Link 2 */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <div className="flex items-center gap-2">
      <Link className="w-4 h-4" />
      Assessment Link 2 (Optional)
    </div>
  </label>
  <input
    type="url"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
    placeholder="https://example.com/assessment2"
    value={form.assessment_link_2}
    onChange={(e) => handleChange('assessment_link_2', e.target.value)}
  />
</div>

{/* Assessment Link 3 */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <div className="flex items-center gap-2">
      <Link className="w-4 h-4" />
      Assessment Link 3 (Optional)
    </div>
  </label>
  <input
    type="url"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
    placeholder="https://example.com/assessment3"
    value={form.assessment_link_3}
    onChange={(e) => handleChange('assessment_link_3', e.target.value)}
  />
</div>
              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/classrooms')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Classroom Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Classroom Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Classroom ID</p>
                <p className="font-medium text-gray-900">#{classroom.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <div className="mt-1">
                  {(() => {
                    const now = new Date()
                    const published = new Date(classroom.published_date || now)
                    const expired = classroom.expiration_date ? new Date(classroom.expiration_date) : null
                    
                    if (expired && expired < now) {
                      return (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Expired
                        </span>
                      )
                    } else if (published <= now) {
                      return (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          Active
                        </span>
                      )
                    } else {
                      return (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                          Upcoming
                        </span>
                      )
                    }
                  })()}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Discussion</p>
                <p className="font-medium text-gray-900">
                  {classroom.discussion_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              {classroom.google_classroom_link && (
                <div>
                  <p className="text-sm text-gray-500">Google Classroom Link</p>
                  <p className="font-medium text-gray-900 truncate">
                    <a 
                      href={classroom.google_classroom_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Link
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Editing Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Update video URL if content changes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">Review learning objectives regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Consider expiration for time-sensitive content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}