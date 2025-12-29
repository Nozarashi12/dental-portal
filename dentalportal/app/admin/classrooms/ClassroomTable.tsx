// app/admin/classrooms/ClassroomTable.tsx (Client Component)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Edit2, Trash2, Eye, Play, Calendar, 
  Users, FileText, Video, Clock, CheckCircle,
  ExternalLink, AlertCircle, BookOpen
} from 'lucide-react'

interface Classroom {
  id: number
  title: string
  speaker: string
  course_id: number
  course_title?: string
  course_author?: string
  course_category?: string
  video_url: string
  description: string
  learning_objectives: string
  author_description: string
  published_date: string
  published_date_formatted?: string
  expiration_date: string | null
  expiration_date_formatted?: string | null
  discussion_enabled: boolean
  assessment_link: string | null
  created_date?: string
  updated_date?: string
  ce_credit: number

}

interface ClassroomsTableProps {
  classrooms?: Classroom[]
}

export default function ClassroomsTable({ classrooms = [] }: ClassroomsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/classrooms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Classroom deleted successfully!')
        window.location.reload()
      } else {
        alert('Failed to delete classroom.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatus = (classroom: Classroom) => {
    const now = new Date()
    const published = new Date(classroom.published_date)
    const expired = classroom.expiration_date ? new Date(classroom.expiration_date) : null
    
    if (expired && expired < now) {
      return {
        text: 'Expired',
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-3 h-3" />
      }
    } else if (published <= now) {
      return {
        text: 'Active',
        color: 'bg-emerald-100 text-emerald-800',
        icon: <CheckCircle className="w-3 h-3" />
      }
    } else {
      return {
        text: 'Upcoming',
        color: 'bg-amber-100 text-amber-800',
        icon: <Clock className="w-3 h-3" />
      }
    }
  }

  if (classrooms.length === 0) {
    return (
      <div className="p-12 text-center">
        <DoorOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No classrooms found</h3>
        <p className="text-gray-600 mt-1">Get started by creating your first classroom</p>
        <Link
          href="/admin/classrooms/create"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create First Classroom
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
            <th className="pb-4 px-6 font-medium">Title & Status</th>
            <th className="pb-4 px-6 font-medium">Course</th>
            <th className="pb-4 px-6 font-medium">Speaker</th>
            <th className="pb-4 px-6 font-medium">Schedule</th>
            <th className="pb-4 px-6 font-medium">CE Credit</th>
            <th className="pb-4 px-6 font-medium">Features</th>
            <th className="pb-4 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {classrooms.map((classroom) => {
            const status = getStatus(classroom)
            
            return (
              <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{classroom.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {classroom.id}
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  {classroom.course_title ? (
                    <div>
                      <div className="font-medium text-gray-900">{classroom.course_title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {classroom.course_author || 'Unknown Author'}
                      </div>
                      {classroom.course_category && (
                        <div className="mt-1">
                          <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {classroom.course_category}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400">Course #{classroom.course_id}</div>
                  )}
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{classroom.speaker}</span>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {formatDate(classroom.published_date)}
                      </span>
                    </div>
                    {classroom.expiration_date && (
                      <div className="text-xs text-gray-500">
                        Expires: {formatDate(classroom.expiration_date)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
  <div className="flex items-center gap-2">
    <BookOpen className="w-4 h-4 text-gray-400" />
    <span className="font-medium text-gray-900">
      {classroom.ce_credit}
    </span>
    <span className="text-xs text-gray-500">Credits</span>
  </div>
</td>

                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {classroom.discussion_enabled && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        <Users className="w-2 h-2" />
                        Discussion
                      </span>
                    )}
                    {classroom.assessment_link && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        <FileText className="w-2 h-2" />
                        Assessment
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                      <Video className="w-2 h-2" />
                      Video
                    </span>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={classroom.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View video"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                   
                    <Link
                      href={`/admin/classrooms/${classroom.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit classroom"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(classroom.id)}
                      disabled={isDeleting === classroom.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete classroom"
                    >
                      {isDeleting === classroom.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Add missing icon components
function DoorOpen({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}