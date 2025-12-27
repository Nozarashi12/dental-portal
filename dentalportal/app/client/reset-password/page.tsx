'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPassword() {
  const params = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleReset() {
    if (!token) {
      setMsg('Invalid or missing token')
      return
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    setMsg(data.message || data.error)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button
        onClick={handleReset}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Reset Password
      </button>
      {msg && <p className="mt-4 text-center text-gray-700">{msg}</p>}
    </div>
  )
}
