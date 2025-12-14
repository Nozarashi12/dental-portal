// app/admin/classrooms/page.tsx (Server Component)
import Link from 'next/link';
import pool from '@/lib/db';
import ClassroomsTable from './ClassroomTable';
import { 
  DoorOpen, Plus, Calendar, Users, 
  Video, Clock, FileText, PlayCircle,
  CheckCircle, XCircle
} from 'lucide-react';

// Fetch classrooms with course information
async function getClassrooms() {
  try {
    const [classrooms] = await pool.query(`
      SELECT 
        c.*,
        co.title as course_title,
        co.author as course_author,
        co.category as course_category,
        DATE_FORMAT(c.published_date, '%Y-%m-%d') as published_date_formatted,
        DATE_FORMAT(c.expiration_date, '%Y-%m-%d') as expiration_date_formatted,
        DATE_FORMAT(c.created_at, '%b %d, %Y') as created_date,
        DATE_FORMAT(c.updated_at, '%b %d, %Y') as updated_date
      FROM classrooms c
      LEFT JOIN courses co ON c.course_id = co.id
      ORDER BY c.created_at DESC
    `);
    return classrooms;
  } catch (error) {
    console.error('Failed to fetch classrooms:', error);
    return [];
  }
}

// Fetch classroom statistics from actual table data
async function getClassroomStats() {
  try {
    // Total classrooms
    const [[{ totalClassrooms }]] = await pool.query('SELECT COUNT(*) as totalClassrooms FROM classrooms');
    
    // Active classrooms (published and not expired)
    const [[{ activeClassrooms }]] = await pool.query(`
      SELECT COUNT(*) as activeClassrooms 
      FROM classrooms 
      WHERE published_date <= NOW() 
      AND (expiration_date IS NULL OR expiration_date >= NOW())
    `);
    
    // Classrooms with discussion enabled
    const [[{ discussionEnabled }]] = await pool.query(`
      SELECT COUNT(*) as discussionEnabled 
      FROM classrooms 
      WHERE discussion_enabled = 1
    `);
    
    // Classrooms with assessment links
    const [[{ hasAssessment }]] = await pool.query(`
      SELECT COUNT(*) as hasAssessment 
      FROM classrooms 
      WHERE assessment_link IS NOT NULL AND assessment_link != ''
    `);
    
    // Expired classrooms
    const [[{ expiredClassrooms }]] = await pool.query(`
      SELECT COUNT(*) as expiredClassrooms 
      FROM classrooms 
      WHERE expiration_date IS NOT NULL AND expiration_date < NOW()
    `);
    
    return { 
      totalClassrooms, 
      activeClassrooms, 
      discussionEnabled, 
      hasAssessment,
      expiredClassrooms
    };
  } catch (error) {
    console.error('Failed to fetch classroom stats:', error);
    return { 
      totalClassrooms: 0, 
      activeClassrooms: 0, 
      discussionEnabled: 0, 
      hasAssessment: 0,
      expiredClassrooms: 0
    };
  }
}

export default async function ClassroomsPage() {
  const [classrooms, stats] = await Promise.all([
    getClassrooms(),
    getClassroomStats()
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
          <p className="text-gray-600 mt-1">Manage learning sessions and classroom materials</p>
        </div>
        <Link
          href="/admin/classrooms/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          Add Classroom
        </Link>
      </div>

      {/* Stats Grid - Only using actual data from table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Classrooms */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Classrooms</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalClassrooms}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DoorOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              All learning sessions
            </div>
          </div>
        </div>

        {/* Active Classrooms */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.activeClassrooms}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <PlayCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-emerald-700">
                {stats.totalClassrooms > 0 ? ((stats.activeClassrooms / stats.totalClassrooms) * 100).toFixed(0) : 0}%
              </span> of total
            </div>
          </div>
        </div>

        {/* Discussion Enabled */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Discussion Enabled</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.discussionEnabled}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-amber-600 font-medium">
              Interactive sessions
            </div>
          </div>
        </div>

        {/* Has Assessment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">With Assessment</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.hasAssessment}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-purple-700">
                {stats.totalClassrooms > 0 ? ((stats.hasAssessment / stats.totalClassrooms) * 100).toFixed(0) : 0}%
              </span> of total
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Classrooms</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and organize learning sessions</p>
            </div>
            <div className="text-sm text-gray-600">
              {classrooms.length} total classrooms
            </div>
          </div>
        </div>

        {/* Classroom Table */}
        <ClassroomsTable classrooms={classrooms} />
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Video className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">All have video URLs</p>
              <p className="text-xs text-gray-500">Required field</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Speaker information</p>
              <p className="text-xs text-gray-500">All classrooms have speakers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Published dates</p>
              <p className="text-xs text-gray-500">All classrooms have publication dates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}