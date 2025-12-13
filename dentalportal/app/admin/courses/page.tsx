'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CourseList from './CourseList';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>

      <Link
        href="/admin/courses/create"
        className="px-4 py-2 bg-emerald-600 text-white rounded"
      >
        Create Course
      </Link>

      {courses.length > 0 ? (
        <CourseList courses={courses} setCourses={setCourses} />
      ) : (
        <p className="mt-4 text-gray-500">No courses found.</p>
      )}
    </div>
  );
}
