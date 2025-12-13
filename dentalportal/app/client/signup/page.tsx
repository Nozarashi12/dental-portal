'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'client'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      // Save token & role
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('userName', formData.name)

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Something went wrong.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-25 h-20">
            <Image
              src="/images/yenepoya_logo.png"
              alt="Yenepoya Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          <div>
            <h1 className="font-bold text-gray-900 text-sm">Yenepoya Dental</h1>
            <p className="text-xs text-emerald-700">CDE Platform</p>
          </div>
        </Link>
      </div>

      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join the Community
          </h1>
          <p className="text-gray-600">
            Register to access premium dental education resources
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg"
                  placeholder="dental.professional@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specialty</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg"
                >
                  <option value="">Select your specialty</option>
                  <option value="general">General Dentistry</option>
                  <option value="ortho">Orthodontics</option>
                  <option value="endo">Endodontics</option>
                  <option value="perio">Periodontics</option>
                  <option value="prostho">Prosthodontics</option>
                  <option value="oral_surgery">Oral Surgery</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 py-3 border rounded-lg"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white ${
                loading ? 'bg-emerald-400' : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p>
              Already have an account?{' '}
              <Link href="/Client/login" className="text-emerald-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
