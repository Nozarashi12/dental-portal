'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle, GraduationCap, Key } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // ✅ IMPORTANT: Also set token in localStorage for immediate Navbar update
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7, path: '/' })
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
      }

      if (data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }

      router.refresh()
    } catch {
      setError('Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
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
            <h1 className="font-bold text-gray-900 text-sm">RAYYAN</h1>
            <p className="text-xs text-emerald-700">LMS Platform</p>
          </div>
        </Link>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your courses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium block">Password</label>
                <Link 
                  href="/client/forgot-password" 
                  className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                >
Forgot Password ?                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg text-white font-semibold transition-colors ${
                loading 
                  ? 'bg-emerald-400 cursor-not-allowed' 
                  : 'bg-emerald-700 hover:bg-emerald-800 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
           

            <p className="text-gray-600">
              Don't have an Account?{' '}
              <Link 
                href="/client/signup" 
                className="text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  )
}