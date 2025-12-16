'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ExternalLink, Loader2, AlertCircle, ArrowLeft, 
  Calendar, User, FileText, Clock, Filter,
  Search, SortAsc, ChevronRight, BookOpen,
  AlertTriangle
} from 'lucide-react'

interface Assessment {
  id: number
  title: string
  assessment_link: string
  author_description?: string
  expiration_date?: string
  published_date?: string
}

interface Course {
  id: number
  title: string
  description?: string
}

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'due'>('due')

  useEffect(() => {
    if (!courseId) return
    fetchData()
  }, [courseId])

  useEffect(() => {
    filterAndSortAssessments()
  }, [assessments, searchQuery, sortBy])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch course info
      const courseRes = await fetch(`/api/admin/courses/${courseId}`)
      if (!courseRes.ok) throw new Error('Failed to fetch course')
      const courseData = await courseRes.json()
      setCourse(courseData)

      // Fetch assessments (from classrooms where assessment_link exists)
      const assessmentRes = await fetch(
        `/api/admin/classrooms/course/${courseId}`
      )
      if (!assessmentRes.ok) throw new Error('Failed to fetch assessments')
      const classroomData = await assessmentRes.json()

      // Filter only classrooms with assessment_link and map to Assessment format
      const assessmentList: Assessment[] = classroomData
        .filter((c: any) => c.assessment_link)
        .map((c: any) => ({
          id: c.id,
          title: c.title,
          assessment_link: c.assessment_link,
          author_description: c.author_description,
          expiration_date: c.expiration_date,
          published_date: c.published_date,
        }))

      setAssessments(assessmentList)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortAssessments = () => {
    let filtered = [...assessments]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(assessment =>
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assessment.author_description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'date':
          const dateA = a.published_date ? new Date(a.published_date).getTime() : 0
          const dateB = b.published_date ? new Date(b.published_date).getTime() : 0
          return dateB - dateA
        case 'due':
          const dueA = a.expiration_date ? new Date(a.expiration_date).getTime() : Infinity
          const dueB = b.expiration_date ? new Date(b.expiration_date).getTime() : Infinity
          return dueA - dueB
        default:
          return 0
      }
    })

    setFilteredAssessments(filtered)
  }

  const getStatusBadge = (assessment: Assessment) => {
    if (assessment.expiration_date) {
      const dueDate = new Date(assessment.expiration_date)
      const now = new Date()
      const timeDiff = dueDate.getTime() - now.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (daysDiff < 0) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        )
      } else if (daysDiff <= 7) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            Due soon
          </span>
        )
      }
    }

    return null
  }

  // Count assessments with expiration dates in certain ranges
  const getUpcomingCount = () => {
    return assessments.filter(assessment => {
      if (!assessment.expiration_date) return false
      const due = new Date(assessment.expiration_date)
      const now = new Date()
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24))
      return diffDays > 0 && diffDays <= 7
    }).length
  }

  const getOverdueCount = () => {
    return assessments.filter(assessment => {
      if (!assessment.expiration_date) return false
      const due = new Date(assessment.expiration_date)
      return due < new Date()
    }).length
  }

  // -------------------- LOADING STATE --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // -------------------- ERROR STATE --------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Assessments</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalAssessments = assessments.length
  const upcomingCount = getUpcomingCount()
  const overdueCount = getOverdueCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
              </div>
              <p className="text-gray-600">Course assessments and learning materials</p>
            </div>
          </div>

          {/* Stats Overview - Only real data */}
          {totalAssessments > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-800 mb-1">Total Assessments</p>
                    <p className="text-2xl font-bold text-emerald-900">{totalAssessments}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Upcoming Due Dates</p>
                    <p className="text-2xl font-bold text-blue-900">{upcomingCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-amber-900">{overdueCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assessments by title or author..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="due">Sort by Due Date</option>
                  <option value="date">Sort by Published Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>

              <button
                onClick={fetchData}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        {filteredAssessments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {assessments.length === 0 
                ? 'No Assessments Available' 
                : 'No Matching Assessments Found'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {assessments.length === 0
                ? 'There are no assessments available for this course yet.'
                : 'Try adjusting your search to see more results.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                Showing {filteredAssessments.length} of {assessments.length} assessments
              </p>
            </div>

            {filteredAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assessment.title}
                          </h3>
                          {getStatusBadge(assessment)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          {assessment.author_description && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{assessment.author_description}</span>
                            </div>
                          )}

                          {assessment.expiration_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(assessment.expiration_date).toLocaleDateString()}</span>
                            </div>
                          )}

                          {assessment.published_date && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Published: {new Date(assessment.published_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <a
                      href={assessment.assessment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Open Assessment
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              All assessments are managed through the course classroom system.
            </p>
            <button 
              onClick={() => router.push(`/admin/courses/${courseId}`)}
              className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
            >
              View Course Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}