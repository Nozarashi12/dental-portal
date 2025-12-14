// app/admin/courses/[id]/edit/EditForm.tsx (Client Component)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, User, Image, FileText, 
  Tag, Save, X, ArrowLeft,
  AlertCircle, CheckCircle, Briefcase
} from 'lucide-react'

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
  const router = useRouter()
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
  const [fetching, setFetching] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchSpecialties()
  }, [])

  const fetchSpecialties = async () => {
    try {
      setFetching(true)
      const res = await fetch('/api/admin/specialties')
      if (res.ok) {
        const data = await res.json()
        setSpecialties(data)
      }
    } catch (error) {
      console.error('Failed to fetch specialties:', error)
    } finally {
      setFetching(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.title.trim()) newErrors.title = 'Course title is required'
    if (!form.author.trim()) newErrors.author = 'Author name is required'
    if (!form.category.trim()) newErrors.category = 'Category is required'
    if (!form.overview.trim()) newErrors.overview = 'Overview is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (field === 'cover_image') {
      setImageError(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          specialty_id: form.specialty_id || null,
        }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setSuccess('Course updated successfully!')
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('')
          router.push('/admin/courses')
        }, 1500)
      } else {
        setErrors({ submit: data.message || 'Failed to update course' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/courses')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-1">Update course information and details</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-emerald-800 font-medium">{success}</div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-red-800 font-medium">{errors.submit}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={submit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Course Information</h2>
                    <p className="text-sm text-gray-600">Update the core details of your course</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Course Title *
                      </div>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter course title"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Author Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.author ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter author name"
                      value={form.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                    />
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category *
                      </div>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Dentistry, Orthodontics, Periodontics"
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
                    <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                    <p className="text-sm text-gray-600">Provide detailed information about the course</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Overview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Overview *
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[120px] resize-y ${
                        errors.overview ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Brief overview of the course (2-3 sentences)"
                      value={form.overview}
                      onChange={(e) => handleChange('overview', e.target.value)}
                    />
                    {errors.overview && (
                      <p className="mt-1 text-sm text-red-600">{errors.overview}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[180px] resize-y ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Full course description with learning objectives, topics covered, etc."
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
                      Author Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[120px] resize-y"
                      placeholder="About the author (qualifications, experience, etc.)"
                      value={form.author_description}
                      onChange={(e) => handleChange('author_description', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Media & Specialty Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Media & Classification</h2>
                    <p className="text-sm text-gray-600">Add visual elements and categorize your course</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Cover Image URL
                      </div>
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="https://example.com/image.jpg"
                      value={form.cover_image}
                      onChange={(e) => handleChange('cover_image', e.target.value)}
                    />
                    {form.cover_image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                        <div className="w-40 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          {!imageError ? (
                            <img 
                              src={form.cover_image} 
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Provide a URL for the course cover image (optional)
                    </p>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Specialty
                      </div>
                    </label>
                    <select
                      value={form.specialty_id || ''}
                      onChange={(e) => handleChange('specialty_id', e.target.value || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      disabled={fetching}
                    >
                      <option value="">Select Specialty (Optional)</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {fetching && (
                      <p className="mt-1 text-sm text-gray-500">Loading specialties...</p>
                    )}
                  </div>
                </div>
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
                      Saving...
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
                  onClick={() => router.push('/admin/courses')}
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
          {/* Course Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Course ID</p>
                <p className="font-medium text-gray-900">#{course.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(course.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {course.updated_at 
                    ? new Date(course.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Editing Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Keep titles clear and descriptive</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">Use high-quality images for better engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Provide detailed descriptions for better search</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}