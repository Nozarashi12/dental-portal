// app/admin/users/page.tsx (Server Component)
import Link from 'next/link'
import UsersTable from './UsersTable'
import pool from '@/lib/db'
import { 
  Users, Shield, UserCircle, CalendarDays, 
  Search, Filter, UserPlus, Download 
} from 'lucide-react'

// Fetch users from DB
async function getUsers() {
  try {
    const [users] = await pool.query(`
      SELECT 
        id, name, email, role,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at,
        DATE_FORMAT(created_at, '%b %d, %Y') as created_date
      FROM users 
      ORDER BY created_at DESC
    `)
    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
  }
}

// Fetch stats with additional insights
async function getUserStats() {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users')
    const [[{ adminCount }]] = await pool.query('SELECT COUNT(*) as adminCount FROM users WHERE role = "admin"')
    const [[{ clientCount }]] = await pool.query('SELECT COUNT(*) as clientCount FROM users WHERE role = "client"')
    const [[{ todayUsers }]] = await pool.query(`
      SELECT COUNT(*) as todayUsers FROM users WHERE DATE(created_at) = CURDATE()
    `)
    const [[{ weekUsers }]] = await pool.query(`
      SELECT COUNT(*) as weekUsers FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `)
    return { totalUsers, adminCount, clientCount, todayUsers, weekUsers }
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
    return { totalUsers: 0, adminCount: 0, clientCount: 0, todayUsers: 0, weekUsers: 0 }
  }
}

export default async function UsersPage() {
  const [users, stats] = await Promise.all([
    getUsers(),
    getUserStats()
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, permissions, and access levels</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button> */}
          <Link
            href="/admin/users/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="w-3 h-3" />
              <span>{stats.weekUsers} new this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Administrators</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.adminCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="text-emerald-600 font-medium">
                {stats.totalUsers > 0 ? ((stats.adminCount / stats.totalUsers) * 100).toFixed(1) : 0}%
              </span> of total
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clients</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.clientCount}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <UserCircle className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="text-purple-600 font-medium">
                {stats.totalUsers > 0 ? ((stats.clientCount / stats.totalUsers) * 100).toFixed(1) : 0}%
              </span> of total
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Today</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.todayUsers}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <CalendarDays className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-amber-600 font-medium">
              Active growth
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Growth Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.weekUsers > 0 ? '+' : ''}{stats.weekUsers}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">↑</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">Last 7 days</div>
          </div>
        </div>
      </div>

     

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <UsersTable users={users} />
      </div>
    </div>
  )
}