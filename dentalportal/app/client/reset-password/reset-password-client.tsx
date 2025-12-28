'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password) { setMsg('Password is required'); return }

    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Reset failed'); return }

      setMsg('Password reset successful. Redirecting...')
      setTimeout(()=>router.push('/client/login'), 2000)
    } catch {
      setMsg('Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="bg-emerald-700 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">RayyanLMS</h1>
          <p className="text-emerald-100 text-sm">Dental Education Platform</p>
        </div>
        
        {/* Form */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-gray-600">Create a new password for your account</p>
          </div>
          
          {!token ? (
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Invalid Reset Link</h3>
              <p className="text-red-600 mb-4">The password reset link is invalid or has expired.</p>
              <a href="/client/forgot-password" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200">
                Request New Reset Link
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input 
                  type="password" 
                  id="password"
                  placeholder="Enter your new password" 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                />
                <p className="mt-2 text-sm text-gray-500">Make sure your password is strong and secure.</p>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </span>
                ) : 'Reset Password'}
              </button>
              
              {msg && (
                <div className={`p-4 rounded-lg text-center ${
                  msg.includes('successful') 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <p className="font-medium">{msg}</p>
                  {msg.includes('successful') && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-emerald-600 h-1 rounded-full animate-[progress_2s_linear]"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  <a href="/client/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    Back to Login
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RayyanLMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}