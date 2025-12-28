'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')

  return (
    <div>
      <h1>Reset Password</h1>

      {!token && (
        <p className="text-red-500">
          Invalid or missing reset token
        </p>
      )}

      {token && (
        <form>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  )
}
