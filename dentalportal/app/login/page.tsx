'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

    // Simulate API call
    setTimeout(() => {
      // Mock validation
      if (email && password) {
        localStorage.setItem('loggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/')
        router.refresh()
      } else {
        setError('Please enter both email and password')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
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
          <p className="text-gray-600">
            Sign in to access your Continuing Dental Education courses
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="dental.professional@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-emerald-700 hover:text-emerald-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white 
                        ${loading 
                          ? 'bg-emerald-400 cursor-not-allowed' 
                          : 'bg-emerald-700 hover:bg-emerald-800'} 
                        transition-colors duration-200 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Google
              </button>
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}