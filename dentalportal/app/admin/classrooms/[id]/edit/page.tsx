// app/admin/classrooms/[id]/edit/page.tsx (Server Component)
import Link from 'next/link';
import pool from '@/lib/db';
import EditClassroomForm from '../edit/EditForm';
import { ArrowLeft } from 'lucide-react';

export default async function EditClassroomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const [[classroom]] = await pool.query(
      'SELECT * FROM classrooms WHERE id = ?',
      [id]
    )

    if (!classroom) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-4">Classroom Not Found</div>
            <p className="text-gray-600 mb-6">The classroom you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/admin/classrooms"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Classrooms
            </Link>
          </div>
        </div>
      )
    }

    return <EditClassroomForm classroom={classroom} />
  } catch (error) {
    console.error('Error loading classroom:', error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-4">Error Loading Classroom</div>
          <p className="text-gray-600 mb-6">There was an error loading the classroom. Please try again later.</p>
          <Link
            href="/admin/classrooms"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classrooms
          </Link>
        </div>
      </div>
    )
  }
}