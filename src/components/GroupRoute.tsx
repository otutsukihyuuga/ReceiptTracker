import { Navigate, Outlet } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'

/**
 * Sits between ProtectedRoute and Layout.
 * If the user has no groups AND hasn't skipped onboarding, send them to /onboarding.
 * Once they skip or create a group, they pass through freely.
 */
export default function GroupRoute() {
  const { groups, loading } = useGroup()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your groups...</p>
        </div>
      </div>
    )
  }

  const skipped = localStorage.getItem('onboardingSkipped') === 'true'

  if (groups.length === 0 && !skipped) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
