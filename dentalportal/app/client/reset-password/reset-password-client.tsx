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
      setTimeout(()=>router.push('/login'), 2000)
    } catch {
      setMsg('Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {!token && <p className="text-red-500 text-center">Invalid or missing reset token</p>}
      {token && (
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2 mb-4"/>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {msg && <p className="mt-4 text-center">{msg}</p>}
        </form>
      )}
    </div>
  )
}
