// app/admin/courses/CourseCard.tsx (Client Component)
'use client';

import Link from 'next/link';
import { Edit2, Trash2, User, Calendar, BookOpen, DoorOpen, Speaker } from 'lucide-react';
import { useState } from 'react';

export default function CourseCard({ course, onDelete }: any) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(course.id);
      } else {
        alert('Failed to delete course.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getLatestClassroomDate = () => {
    if (!course.latest_classroom_date) return 'No classrooms';
    try {
      const date = new Date(course.latest_classroom_date);
      return `Latest: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } catch {
      return 'No classrooms';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Header with Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {course.cover_image ? (
          <img 
            src={course.cover_image} 
            alt={course.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${course.cover_image ? 'hidden' : ''}`}>
          <BookOpen className="w-12 h-12 text-gray-300" />
        </div>
        
        {/* Classroom Badge */}
        {course.classroom_count > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <DoorOpen className="w-3 h-3" />
              {course.classroom_count} Classroom{course.classroom_count !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {course.overview || 'No description available'}
          </p>
        </div>

        {/* Course Meta */}
        <div className="space-y-3">
          {/* Author */}
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm truncate">{course.author || 'Unknown Author'}</span>
          </div>

          {/* Category and Speakers */}
          <div className="flex flex-wrap gap-2">
            {course.category && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {course.category}
              </span>
            )}
            {course.speaker_count > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                <Speaker className="w-3 h-3" />
                {course.speaker_count} Speaker{course.speaker_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(course.created_at)}</span>
            </div>
            <div className="text-xs">
              {getLatestClassroomDate()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              href={`/admin/courses/${course.id}/classrooms`}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View Classrooms
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Edit course"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete course"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}