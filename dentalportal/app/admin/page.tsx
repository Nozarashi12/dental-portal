import Link from 'next/link';
import pool from '@/lib/db';
import { 
  Users, BookOpen, DoorOpen, Calendar, 
  TrendingUp, Clock, UserCog, FileText,
  Eye, Edit2 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminPage() {
  // Fetch stats with more detail
  const [[{ coursesCount }]] = await pool.query('SELECT COUNT(*) as coursesCount FROM courses');
  const [[{ classroomsCount }]] = await pool.query('SELECT COUNT(*) as classroomsCount FROM classrooms');
  const [[{ usersCount }]] = await pool.query('SELECT COUNT(*) as usersCount FROM users');
  const [[{ adminsCount }]] = await pool.query('SELECT COUNT(*) as adminsCount FROM users WHERE role = "admin"');
  const [[{ clientsCount }]] = await pool.query('SELECT COUNT(*) as clientsCount FROM users WHERE role = "client"');

  // Fetch recent activities
  const [recentCourses] = await pool.query(`
    SELECT id, title, author, category, created_at 
    FROM courses 
    ORDER BY created_at DESC 
    LIMIT 5
  `);

  const [recentUsers] = await pool.query(`
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 5
  `);

  const [recentClassrooms] = await pool.query(`
    SELECT c.id, c.title, co.title as course_title, c.published_date, c.speaker
    FROM classrooms c
    LEFT JOIN courses co ON c.course_id = co.id
    ORDER BY c.published_date DESC 
    LIMIT 5
  `);

  // Fetch course categories distribution
  const [categoryStats] = await pool.query(`
    SELECT category, COUNT(*) as count 
    FROM courses 
    GROUP BY category 
    ORDER BY count DESC
  `);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your platform and track activities</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/courses/create" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
          >
            <BookOpen className="w-4 h-4" />
            Create Course
          </Link>
          <Link 
            href="/admin/classrooms/create" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 hover:border-gray-400"
          >
            <DoorOpen className="w-4 h-4" />
            Create Classroom
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">{usersCount}</h3>
            <p className="text-gray-600 mt-1">Users Registered</p>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <UserCog className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">{adminsCount}</span> admin
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">{clientsCount}</span> clients
            </span>
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Published</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">{coursesCount}</h3>
            <p className="text-gray-600 mt-1">Courses Available</p>
          </div>
          {categoryStats.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Top Category</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                <BookOpen className="w-3 h-3" />
                {categoryStats[0].category} ({categoryStats[0].count})
              </span>
            </div>
          )}
        </div>

        {/* Classrooms Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DoorOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">{classroomsCount}</h3>
            <p className="text-gray-600 mt-1">Classrooms</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Latest: {recentClassrooms[0]?.title?.substring(0, 20) || 'No classrooms'}</span>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">24h</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {recentUsers.filter((user: any) => {
                const createdAt = new Date(user.created_at);
                const now = new Date();
                const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
                return diffInHours <= 24;
              }).length}
            </h3>
            <p className="text-gray-600 mt-1">New Users Today</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
                <p className="text-sm text-gray-600 mt-1">Latest published courses</p>
              </div>
              <Link 
                href="/admin/courses" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCourses.map((course: any) => (
              <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserCog className="w-3 h-3" />
                        {course.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
                    </span>
                    <div className="flex gap-1">
                      <Link 
                      href="/admin/courses"                        
 className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Course"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                <p className="text-sm text-gray-600 mt-1">New registrations</p>
              </div>
              <Link 
                href="/admin/users" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user: any) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      <span className={`font-semibold ${
                        user.role === 'admin' ? 'text-emerald-700' : 'text-blue-700'
                      }`}>
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </span>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Classrooms */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Classrooms</h2>
                <p className="text-sm text-gray-600 mt-1">Latest published learning sessions</p>
              </div>
              <Link 
                href="/admin/classrooms" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 px-6 font-medium">Title</th>
                  <th className="pb-3 px-6 font-medium">Course</th>
                  <th className="pb-3 px-6 font-medium">Speaker</th>
                  <th className="pb-3 px-6 font-medium">Published</th>
                  <th className="pb-3 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentClassrooms.map((classroom: any) => (
                  <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{classroom.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600">{classroom.course_title || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600">{classroom.speaker}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500">
                        {classroom.published_date 
                          ? new Date(classroom.published_date).toLocaleDateString()
                          : 'Not set'
                        }
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link 
                          href="/admin/classrooms" 
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Classroom"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/classrooms/${classroom.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Classroom"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {categoryStats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryStats.map((stat: any) => (
              <div 
                key={stat.category} 
                className="bg-gray-50 rounded-lg p-4 hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-bold text-gray-900">{stat.count}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 truncate" title={stat.category}>
                  {stat.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}