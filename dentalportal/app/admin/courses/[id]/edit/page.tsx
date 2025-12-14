// app/admin/courses/[id]/edit/page.tsx (Server Component)
import Link from 'next/link';
import pool from '@/lib/db';
import EditForm from './EditForm';
import { ArrowLeft } from 'lucide-react';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const [[course]] = await pool.query(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    )

    if (!course) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</div>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
          </div>
        </div>
      )
    }

    return <EditForm course={course} />
  } catch (error) {
    console.error('Error loading course:', error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-4">Error Loading Course</div>
          <p className="text-gray-600 mb-6">There was an error loading the course. Please try again later.</p>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }
}