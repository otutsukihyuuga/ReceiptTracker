import { useState } from 'react'
import { Receipt, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

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

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="alex@family.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs text-violet-600 hover:underline">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Family name</label>
                <input
                  type="text"
                  placeholder="e.g. Johnson Family"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative text-center">
              <span className="bg-white px-3 text-xs text-gray-400">or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
