'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

  if (isSignUp) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) setError(error.message)
  else setError('Check your email to confirm your account before signing in!')
} else {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) setError(error.message)
  else router.push('/dashboard')
}

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-orange-200 rounded-2xl p-8 space-y-6 shadow-2xl shadow-orange-100/50">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center mb-2">
            <Image src="/record.png" alt="Logo" width={48} height={48} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-orange-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-orange-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition"
            required
          />

          {error && (
  <p className={`text-sm ${error.includes('Check your email') ? 'text-amber-400' : 'text-red-400'}`}>
    {error}
  </p>
)}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-400 hover:text-orange-300 hover:underline transition"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </main>
  )
}