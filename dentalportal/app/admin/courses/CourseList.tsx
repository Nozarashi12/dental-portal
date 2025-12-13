'use client';

import CourseCard from './CourseCard';

export default function CourseList({ courses, setCourses }: any) {
  const handleDelete = (deletedId: number) => {
    setCourses(courses.filter((course: any) => course.id !== deletedId));
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {courses.map((course: any) => (
        <CourseCard key={course.id} course={course} onDelete={handleDelete} />
      ))}
    </div>
  );
}
