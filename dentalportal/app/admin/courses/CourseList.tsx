// app/admin/courses/CourseList.tsx (Client Component)
'use client';

import CourseCard from './CourseCard';
import { useState } from 'react';

export default function CourseList({ courses: initialCourses }: any) {
  const [courses, setCourses] = useState(initialCourses);

  const handleDelete = (deletedId: number) => {
    setCourses(courses.filter((course: any) => course.id !== deletedId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course: any) => (
        <CourseCard key={course.id} course={course} onDelete={handleDelete} />
      ))}
    </div>
  );
}