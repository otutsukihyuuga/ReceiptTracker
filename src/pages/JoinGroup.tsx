import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../context/GroupContext'

type Status = 'loading' | 'found' | 'joining' | 'joined' | 'already_member' | 'error'

export default function JoinGroup() {
  const { code } = useParams<{ code: string }>()
  const { user } = useAuth()
  const { refetchGroups, setActiveGroup } = useGroup()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>('loading')
  const [groupName, setGroupName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!code || !user) return

    const lookupGroup = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, invite_code')
        .eq('invite_code', code)
        .single()

      if (error || !data) {
        setStatus('error')
        setError('Invite link is invalid or has expired.')
        return
      }

      setGroupName(data.name)

      // Check if already a member
      const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', data.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        setStatus('already_member')
      } else {
        setStatus('found')
      }
    }

    lookupGroup()
  }, [code, user])

  const handleJoin = async () => {
    if (!code || !user) return
    setStatus('joining')

    // Ensure profile exists
    await supabase.from('profiles').upsert(
      { id: user.id, full_name: user.user_metadata?.full_name ?? null },
      { onConflict: 'id' }
    )

    // Get group id from invite code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, created_by, invite_code, created_at')
      .eq('invite_code', code)
      .single()

    if (groupError || !group) {
      setStatus('error')
      setError('Failed to find the group.')
      return
    }

    const { error: joinError } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id })

    if (joinError) {
      setStatus('error')
      setError(joinError.message)
      return
    }

    setStatus('joined')
    await refetchGroups()
    setActiveGroup(group)
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">

        {status === 'loading' && (
          <>
            <Loader2 size={32} className="text-violet-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Looking up invite link...</p>
          </>
        )}

        {status === 'found' && (
          <>
            <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-violet-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">You're invited!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Join <span className="font-semibold text-gray-800">{groupName}</span> to start tracking expenses together.
            </p>
            <button
              onClick={handleJoin}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Join {groupName}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              Cancel
            </button>
          </>
        )}

        {status === 'joining' && (
          <>
            <Loader2 size={32} className="text-violet-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Joining {groupName}...</p>
          </>
        )}

        {status === 'joined' && (
          <>
            <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">You're in!</h1>
            <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'already_member' && (
          <>
            <CheckCircle2 size={40} className="text-violet-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">Already a member</h1>
            <p className="text-gray-500 text-sm mb-5">
              You're already in <span className="font-semibold">{groupName}</span>.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">Invalid invite</h1>
            <p className="text-gray-500 text-sm mb-5">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Go Home
            </button>
          </>
        )}

      </div>
    </div>
  )
}
