'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Save, LogOut, CheckCircle, AlertCircle, KeyRound, Shield } from 'lucide-react'

export default function AdminProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/profile')
      if (res.ok) {
        const data = await res.json()
        setForm(prev => ({ ...prev, name: data.name || '' }))
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess('Profile updated successfully!')
        setForm(prev => ({ ...prev, password: '' }))
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to update profile')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/client/login')
    } catch {
      alert('Failed to logout. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-600">Update your name and password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter new password (optional)"
              />
              <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  )
}
