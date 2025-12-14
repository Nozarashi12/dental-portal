// app/admin/courses/page.tsx (Server Component)
import Link from 'next/link';
import pool from '@/lib/db';
import CourseList from './CourseList';
import { 
  BookOpen, Plus, DoorOpen, Calendar,
  Users, Clock, FileText, TrendingUp
} from 'lucide-react';

// Fetch all courses with classroom data
async function getCourses() {
  try {
    const [courses] = await pool.query(`
      SELECT 
        c.*,
        DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i') as formatted_created_at,
        DATE_FORMAT(c.created_at, '%b %d, %Y') as created_date,
        (SELECT COUNT(*) FROM classrooms WHERE course_id = c.id) as classroom_count,
        (SELECT COUNT(DISTINCT speaker) FROM classrooms WHERE course_id = c.id) as speaker_count,
        (SELECT MAX(published_date) FROM classrooms WHERE course_id = c.id) as latest_classroom_date
      FROM courses c
      ORDER BY c.created_at DESC
    `);
    return courses;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

// Fetch course statistics from available tables
async function getCourseStats() {
  try {
    // Total courses
    const [[{ totalCourses }]] = await pool.query('SELECT COUNT(*) as totalCourses FROM courses');
    
    // Courses with classrooms
    const [[{ activeCourses }]] = await pool.query(`
      SELECT COUNT(DISTINCT c.id) as activeCourses 
      FROM courses c
      INNER JOIN classrooms cl ON c.id = cl.course_id
      WHERE cl.published_date IS NOT NULL
    `);
    
    // Total classrooms
    const [[{ totalClassrooms }]] = await pool.query('SELECT COUNT(*) as totalClassrooms FROM classrooms');
    
    // Today's courses (created today)
    const [[{ todayCourses }]] = await pool.query(`
      SELECT COUNT(*) as todayCourses 
      FROM courses 
      WHERE DATE(created_at) = CURDATE()
    `);
    
    // Classroom speakers (unique speakers across all classrooms)
    const [[{ totalSpeakers }]] = await pool.query(`
      SELECT COUNT(DISTINCT speaker) as totalSpeakers 
      FROM classrooms 
      WHERE speaker IS NOT NULL AND speaker != ''
    `);
    
    return { 
      totalCourses, 
      activeCourses, 
      totalClassrooms,
      todayCourses,
      totalSpeakers
    };
  } catch (error) {
    console.error('Failed to fetch course stats:', error);
    return { 
      totalCourses: 0, 
      activeCourses: 0, 
      totalClassrooms: 0,
      todayCourses: 0,
      totalSpeakers: 0
    };
  }
}

// Fetch course categories distribution
async function getCategoryStats() {
  try {
    const [categoryStats] = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM courses 
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category 
      ORDER BY count DESC
      LIMIT 8
    `);
    return categoryStats;
  } catch (error) {
    console.error('Failed to fetch category stats:', error);
    return [];
  }
}

export default async function CoursesPage() {
  // Fetch all data in parallel
  const [courses, stats, categoryStats] = await Promise.all([
    getCourses(),
    getCourseStats(),
    getCategoryStats()
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Create and manage educational courses</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Link>
      </div>

      {/* Stats Grid - Only using available data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCourses}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-700">{stats.todayCourses}</span> new today
            </div>
          </div>
        </div>

        {/* Active Courses (with classrooms) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">With Classrooms</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.activeCourses}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <DoorOpen className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-emerald-700">
                {stats.totalCourses > 0 ? ((stats.activeCourses / stats.totalCourses) * 100).toFixed(0) : 0}%
              </span> of total
            </div>
          </div>
        </div>

        {/* Total Classrooms */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Classrooms</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalClassrooms}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Across all courses
            </div>
          </div>
        </div>

        {/* Today's Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Today</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.todayCourses}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-amber-600 font-medium">
              Active growth
            </div>
          </div>
        </div>

        {/* Total Speakers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unique Speakers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalSpeakers}</h3>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              In classrooms
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-2">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">
              All Courses ({courses.length})
            </div>
          </div>

          {/* Courses List */}
          {courses.length > 0 ? (
            <CourseList courses={courses} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
              <p className="text-gray-600 mt-1 max-w-md mx-auto">
                Get started by creating your first course.
              </p>
              <Link
                href="/admin/courses/create"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Course
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar - Only Category Distribution */}
        <div className="space-y-6">
          {/* Category Distribution */}
          {categoryStats.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h3>
              <div className="space-y-4">
                {categoryStats.map((stat: any) => (
                  <div key={stat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{stat.category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ 
                          width: `${Math.max((stat.count / Math.max(...categoryStats.map((s: any) => s.count))) * 100, 10)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-700">Courses with classrooms</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.activeCourses} / {stats.totalCourses}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-700">New today</span>
                </div>
                <span className="text-sm font-medium text-amber-700">{stats.todayCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm text-gray-700">Average classrooms per course</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalCourses > 0 ? (stats.totalClassrooms / stats.totalCourses).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}