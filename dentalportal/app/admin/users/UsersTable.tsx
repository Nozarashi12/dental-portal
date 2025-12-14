// app/admin/users/UsersTable.tsx (Client Component)
'use client'

import { useState } from 'react'
import { 
  Edit2, Trash2, Save, X, User, Shield, 
  Mail, Calendar, MoreVertical, ShieldCheck,
  User as UserIcon, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function UsersTable({ users: initialUsers }: any) {
  const [users, setUsers] = useState(initialUsers)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [isLoading, setIsLoading] = useState<number | null>(null)

  const handleEdit = (user: any) => {
    setEditingId(user.id)
    setEditData({ ...user })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleSave = async (id: number) => {
    setIsLoading(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...editData } : u))
        setEditingId(null)
        setEditData({})
        alert('User updated successfully!')
      } else {
        alert('Failed to update user')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    setIsLoading(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id))
        alert('User deleted successfully')
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const handleChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">{users.length} total users</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="pb-4 px-6 font-medium">User</th>
              <th className="pb-4 px-6 font-medium">Role</th>
              <th className="pb-4 px-6 font-medium">Joined</th>
              <th className="pb-4 px-6 font-medium">Status</th>
              <th className="pb-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="text-gray-400">
                    <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-gray-500">No users found</p>
                    <p className="text-sm mt-1">Start by adding your first user</p>
                  </div>
                </td>
              </tr>
            ) : users.map((user: any) => (
              <tr 
                key={user.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  editingId === user.id ? 'bg-emerald-50' : ''
                }`}
              >
                <td className="py-4 px-6">
                  {editingId === user.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          editData.role === 'admin' ? 'bg-emerald-100' : 'bg-blue-100'
                        }`}>
                          <span className={`font-bold ${
                            editData.role === 'admin' ? 'text-emerald-700' : 'text-blue-700'
                          }`}>
                            {getInitials(editData.name || user.name)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <input
                            value={editData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            placeholder="Full name"
                          />
                        </div>
                      </div>
                      <input
                        value={editData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="Email address"
                        type="email"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-emerald-100' : 'bg-blue-100'
                      }`}>
                        <span className={`font-bold ${
                          user.role === 'admin' ? 'text-emerald-700' : 'text-blue-700'
                        }`}>
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          {user.role === 'admin' && (
                            <Shield className="w-3 h-3 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">ID: {user.id}</div>
                      </div>
                    </div>
                  )}
                </td>

                <td className="py-4 px-6">
                  {editingId === user.id ? (
                    <select 
                      value={editData.role}
                      onChange={e => handleChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    >
                      <option value="admin">Administrator</option>
                      <option value="client">Client</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        user.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Client
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </td>

                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {user.created_date}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700">Active</span>
                  </div>
                </td>

                <td className="py-4 px-6">
  <div className="flex items-center justify-end gap-2">
    {editingId === user.id ? (
      <>
        <button
          onClick={() => handleSave(user.id)}
          disabled={isLoading === user.id}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === user.id ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save className="w-3 h-3" />
              Save
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading === user.id}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-3 h-3" />
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => handleEdit(user)}
          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Edit user"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          disabled={isLoading === user.id}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete user"
        >
          {isLoading === user.id ? (
            <span className="animate-pulse w-4 h-4 block"></span>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </>
    )}
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {users.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm font-medium">1</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}