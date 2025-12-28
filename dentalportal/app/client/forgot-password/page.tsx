'use client'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email) { setMsg('Email is required'); return }

    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMsg(data.message || data.error)
    } catch {
      setMsg('Something went wrong')
    } finally {
      setLoading(false)
    }
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                placeholder="Enter your registered email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
              />
            </div>
            
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Link...
                </span>
              ) : 'Send Reset Link'}
            </button>
            
            {msg && (
              <div className={`p-4 rounded-lg text-center ${
                msg.includes('required') || msg.includes('error') || msg.includes('wrong') || msg.includes('Failed') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <p className="font-medium">{msg}</p>
              </div>
            )}
            
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600">
                Remember your password?{' '}
                <a href="/client/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Back to Login
                </a>
              </p>
            </div>
          </div>
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