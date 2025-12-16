'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ExternalLink, Loader2, AlertCircle, ArrowLeft, 
  MessageSquare, Users, Calendar, Globe, BookOpen,
  ChevronRight, Sparkles, ArrowUpRight
} from 'lucide-react'

interface Classroom {
  id: number
  title: string
  discussion_enabled: boolean
  google_classroom_link?: string
  published_date: string
  speaker: string
}

interface Course {
  id: number
  title: string
  author: string
}

export default function DiscussionPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0
  })

  useEffect(() => {
    if (!courseId) return
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch course
      const courseRes = await fetch(`/api/admin/courses/${courseId}`)
      if (!courseRes.ok) throw new Error('Failed to fetch course')
      const courseData = await courseRes.json()
      setCourse(courseData)

      // Fetch classrooms
      const classroomRes = await fetch(
        `/api/admin/classrooms/course/${courseId}`
      )
      if (!classroomRes.ok) throw new Error('Failed to fetch discussions')
      const classroomData = await classroomRes.json()
      
      setClassrooms(classroomData)
      
      // Calculate stats
      const discussionClassrooms = classroomData.filter(
        (c: Classroom) => c.discussion_enabled && c.google_classroom_link
      )
      
      const now = new Date()
      const activeDiscussions = discussionClassrooms.filter(
        (c: Classroom) => {
          const published = new Date(c.published_date)
          return published <= now
        }
      )
      
      setStats({
        total: discussionClassrooms.length,
        active: activeDiscussions.length
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const discussionClassrooms = classrooms.filter(
    c => c.discussion_enabled && c.google_classroom_link
  )

  const getDiscussionStatus = (publishedDate: string) => {
    const now = new Date()
    const published = new Date(publishedDate)
    return published <= now ? 'active' : 'upcoming'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // -------------------- LOADING STATE --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
            </div>
            <div className="space-y-4 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------- ERROR STATE --------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchData}
              className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discussions
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {course?.title}
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course by {course?.author} • {discussionClassrooms.length} discussion{classrooms.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {stats.active} active discussion{stats.active !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Discussions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Platform</p>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Google Classroom
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discussions List */}
        <div>
          {discussionClassrooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No discussions yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Discussions will appear here once they're enabled for classrooms in this course.
                </p>
                <button
                  onClick={() => router.push(`/admin/courses/${courseId}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Go to Course
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  All Discussions ({discussionClassrooms.length})
                </h2>
                <div className="text-sm text-gray-500">
                  Sorted by date
                </div>
              </div>

              <div className="space-y-4">
                {discussionClassrooms.map((classroom) => {
                  const status = getDiscussionStatus(classroom.published_date)
                  
                  return (
                    <div
                      key={classroom.id}
                      className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}></div>
                              {status === 'active' ? 'Active' : 'Upcoming'}
                            </span>
                            <div className="text-sm text-gray-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(classroom.published_date)}
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {classroom.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              Speaker: {classroom.speaker}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4" />
                              Interactive discussion
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <a
                            href={classroom.google_classroom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-all duration-300 group/link"
                          >
                            <span>Join Discussion</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      </div>
                      
                      {status === 'upcoming' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4" />
                            Discussion opens {formatDate(classroom.published_date)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        {discussionClassrooms.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Globe className="w-3 h-3 text-blue-600" />
              </div>
              <p>
                All discussions are hosted on Google Classroom. You'll need to sign in with your Google account to participate.
                <a 
                  href="https://classroom.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline ml-1"
                >
                  Learn more
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}