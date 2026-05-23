import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Receipt, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // Already logged in — redirect to dashboard
  if (user) return <Navigate to="/" replace />

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccessMessage('Check your email for a confirmation link!')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-600 rounded-xl mb-4">
            <Receipt size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ReceiptTrack</h1>
          <p className="text-gray-500 text-sm mt-1">Track your family's expenses together</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>

          {/* Success message */}
          {successMessage && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  required={!isLogin}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@family.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!form.email) { setError('Enter your email first'); return }
                      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      })
                      if (error) setError(error.message)
                      else setSuccessMessage('Password reset email sent!')
                    }}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage('') }}
            className="text-violet-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
