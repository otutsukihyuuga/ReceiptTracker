import { useEffect, useState } from 'react'
import { Bell, Shield, Users, Palette, Link2, Copy, Check, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../context/GroupContext'
import { useNavigate } from 'react-router-dom'

interface Member {
  user_id: string
  joined_at: string
  profile: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

const avatarColors = [
  'from-violet-400 to-violet-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-amber-400 to-amber-500',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
]

function Section({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <Icon size={16} className="text-violet-600" />
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-violet-600 peer-focus:ring-2 peer-focus:ring-violet-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  )
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const { activeGroup, groups, refetchGroups } = useGroup()
  const navigate = useNavigate()

  const [members, setMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersError, setMembersError] = useState('')
  const [copied, setCopied] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const inviteLink = activeGroup
    ? `${window.location.origin}/join/${activeGroup.invite_code}`
    : ''

  const isGroupCreator = activeGroup?.created_by === user?.id

  useEffect(() => {
    if (!activeGroup) return
    fetchMembers()
  }, [activeGroup])

  const fetchMembers = async () => {
    if (!activeGroup) return
    setMembersLoading(true)
    setMembersError('')

    const { data, error } = await supabase
      .from('group_members')
      .select('user_id, joined_at, profile:profiles(full_name, avatar_url)')
      .eq('group_id', activeGroup.id)
      .order('joined_at', { ascending: true })

    if (error) {
      setMembersError(error.message)
    } else {
      const normalized = (data ?? []).map((row) => ({
        user_id: row.user_id,
        joined_at: row.joined_at,
        profile: Array.isArray(row.profile) ? row.profile[0] ?? null : row.profile,
      })) as Member[]
      setMembers(normalized)
    }
    setMembersLoading(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemoveMember = async (userId: string) => {
    if (!activeGroup) return
    setRemovingId(userId)
    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', activeGroup.id)
      .eq('user_id', userId)
    await fetchMembers()
    setRemovingId(null)
  }

  const handleLeaveGroup = async () => {
    if (!activeGroup || !user) return
    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', activeGroup.id)
      .eq('user_id', user.id)
    await refetchGroups()
    navigate('/')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and group preferences.</p>
      </div>

      {/* Group Members */}
      <Section icon={Users} title={`Members — ${activeGroup?.name ?? 'No group selected'}`}>
        {!activeGroup ? (
          <p className="text-sm text-gray-400">Select a group from the sidebar to manage its members.</p>
        ) : (
          <>
            {membersError && (
              <div className="flex items-center gap-2 text-sm text-red-500 mb-3">
                <AlertCircle size={14} /> {membersError}
              </div>
            )}

            {membersLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 size={14} className="animate-spin" /> Loading members...
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {members.map((m, i) => {
                  const name = m.profile?.full_name ?? 'Unknown user'
                  const isYou = m.user_id === user?.id
                  const isCreator = m.user_id === activeGroup.created_by
                  const color = avatarColors[i % avatarColors.length]

                  return (
                    <div key={m.user_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {name}
                            {isYou && <span className="text-xs text-gray-400 ml-1">(you)</span>}
                          </p>
                          {isCreator && (
                            <p className="text-xs text-violet-500">Owner</p>
                          )}
                        </div>
                      </div>

                      {/* Remove button — owner can remove others, anyone can remove themselves */}
                      {(isGroupCreator && !isYou) || (!isGroupCreator && isYou) ? (
                        <button
                          onClick={() => isYou ? handleLeaveGroup() : handleRemoveMember(m.user_id)}
                          disabled={removingId === m.user_id}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title={isYou ? 'Leave group' : 'Remove member'}
                        >
                          {removingId === m.user_id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Groups the user is in */}
            {groups.length > 1 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your other groups</p>
                <div className="flex flex-wrap gap-2">
                  {groups.filter(g => g.id !== activeGroup.id).map(g => (
                    <span key={g.id} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{g.name}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
                {copied ? 'Link copied!' : '+ Add member via invite link'}
              </button>
            </div>
          </>
        )}
      </Section>

      {/* Invite Link */}
      {activeGroup && (
        <Section icon={Link2} title="Invite Link">
          <p className="text-sm text-gray-500 mb-3">
            Share this link with anyone you want to add to <span className="font-medium text-gray-700">{activeGroup.name}</span>. Anyone with the link can join.
          </p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <code className="text-sm text-violet-700 font-mono flex-1 truncate">{inviteLink}</code>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 shrink-0 transition-colors"
            >
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </Section>
      )}

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <div className="space-y-1 divide-y divide-gray-100">
          <Toggle label="Split requests" description="When a member creates a new split" defaultOn />
          <Toggle label="Payment reminders" description="Remind you about pending payments" defaultOn />
          <Toggle label="New bill uploaded" description="When any member uploads a bill" />
          <Toggle label="Monthly summary" description="Receive a monthly spending report" defaultOn />
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance">
        <p className="text-sm text-gray-500 mb-3">Choose your preferred theme.</p>
        <div className="flex gap-3">
          {['Light', 'Dark', 'System'].map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${t === 'Light' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      {/* Account */}
      <Section icon={Shield} title="Account">
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Signed in as</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          {!isGroupCreator && activeGroup && (
            <button
              onClick={handleLeaveGroup}
              className="w-full text-left text-sm text-amber-500 hover:text-amber-600 py-2 border-b border-gray-100"
            >
              Leave {activeGroup.name} →
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="w-full text-left text-sm text-red-500 hover:text-red-600 py-2"
          >
            Sign out →
          </button>
        </div>
      </Section>
    </div>
  )
}
