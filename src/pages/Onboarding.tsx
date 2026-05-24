import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt, Users, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../context/GroupContext'

export default function Onboarding() {
  const { user } = useAuth()
  const { refetchGroups } = useGroup()
  const navigate = useNavigate()

  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !groupName.trim()) return

    setLoading(true)
    setError('')

    // 0. Ensure the profile row exists (handles users who signed up before the trigger was deployed)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // 1. Create the group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name: groupName.trim(), created_by: user.id })
      .select()
      .single()

    if (groupError || !group) {
      setError(groupError?.message ?? 'Failed to create group')
      setLoading(false)
      return
    }

    // 2. Add the creator as a member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id })

    if (memberError) {
      setError(memberError.message)
      setLoading(false)
      return
    }

    // 3. Refresh group context and go to dashboard
    await refetchGroups()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-600 rounded-xl mb-4">
            <Receipt size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ReceiptTrack</h1>
          <p className="text-gray-500 text-sm mt-1">Create a group to start tracking expenses together.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* What is a group */}
          <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-100 rounded-xl mb-6">
            <Users size={18} className="text-violet-600 mt-0.5 shrink-0" />
            <p className="text-sm text-violet-700">
              A <strong>group</strong> is a shared space where members can see each other's bills, split expenses, and track spending together. You can be in multiple groups.
            </p>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-4">Create your first group</h2>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Group name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Johnson Household, Roommates, Road Trip"
                required
                maxLength={50}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-gray-400 mt-1">You can rename this or create more groups later.</p>
            </div>

            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Create Group & Continue
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can also use ReceiptTrack solo — just skip this and track personal bills without a group. <br />
          <button
            onClick={() => {
              localStorage.setItem('onboardingSkipped', 'true')
              navigate('/')
            }}
            className="text-violet-500 hover:underline mt-1 inline-block"
          >
            Skip for now →
          </button>
        </p>
      </div>
    </div>
  )
}
