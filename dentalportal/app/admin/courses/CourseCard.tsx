'use client';

import Link from 'next/link';

export default function CourseCard({ course, onDelete }: any) {
  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;

    const res = await fetch(`/api/admin/courses/${course.id}`, { method: 'DELETE' });
    if (res.ok) {
      onDelete?.(course.id); // remove from UI immediately
    } else {
      alert('Failed to delete course.');
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-semibold">{course.title}</h3>
      <p className="text-gray-600">{course.author}</p>
      <p className="text-sm text-gray-500">Specialty: {course.specialty_name || '-'}</p>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Edit
        </Link>

        <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
}
