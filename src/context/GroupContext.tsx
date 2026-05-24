import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export interface Group {
  id: string
  name: string
  created_by: string
  invite_code: string
  created_at: string
}

interface GroupContextType {
  groups: Group[]
  activeGroup: Group | null
  setActiveGroup: (group: Group) => void
  loading: boolean
  refetchGroups: () => Promise<void>
}

const GroupContext = createContext<GroupContextType>({
  groups: [],
  activeGroup: null,
  setActiveGroup: () => {},
  loading: true,
  refetchGroups: async () => {},
})

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [activeGroup, setActiveGroupState] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([])
      setActiveGroupState(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch all groups the user is a member of (or created)
    const { data, error } = await supabase
      .from('group_members')
      .select('group:groups(id, name, created_by, invite_code, created_at)')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching groups:', error)
      setLoading(false)
      return
    }

    const fetched = (data ?? [])
      .map((row) => {
        const g = row.group
        return Array.isArray(g) ? g[0] : g
      })
      .filter(Boolean) as Group[]

    setGroups(fetched)

    // Restore last active group from localStorage, or default to first
    const savedId = localStorage.getItem('activeGroupId')
    const saved = fetched.find((g) => g.id === savedId)
    setActiveGroupState(saved ?? fetched[0] ?? null)

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const setActiveGroup = (group: Group) => {
    setActiveGroupState(group)
    localStorage.setItem('activeGroupId', group.id)
  }

  return (
    <GroupContext.Provider
      value={{ groups, activeGroup, setActiveGroup, loading, refetchGroups: fetchGroups }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  return useContext(GroupContext)
}
