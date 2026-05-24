import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Upload,
  BarChart2,
  SplitSquareVertical,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../context/GroupContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bills', label: 'Bills', icon: Receipt },
  { to: '/upload', label: 'Upload Bill', icon: Upload },
  { to: '/analysis', label: 'Analysis', icon: BarChart2 },
  { to: '/splits', label: 'Splits', icon: SplitSquareVertical },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { groups, activeGroup, setActiveGroup } = useGroup()
  const navigate = useNavigate()
  const [groupMenuOpen, setGroupMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'User'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Receipt size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">ReceiptTrack</span>
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Group Switcher */}
        <div className="px-4 py-3 border-b border-gray-100 relative">
          <button
            onClick={() => setGroupMenuOpen(!groupMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-xs shrink-0">
                {activeGroup?.name.charAt(0).toUpperCase() ?? '?'}
              </div>
              <span className="text-gray-700 font-medium truncate">
                {activeGroup?.name ?? 'No group'}
              </span>
            </div>
            <ChevronDown size={14} className={clsx('text-gray-400 transition-transform shrink-0', groupMenuOpen && 'rotate-180')} />
          </button>

          {groupMenuOpen && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              {groups.length === 0 && (
                <p className="px-3 py-2.5 text-xs text-gray-400 italic">No groups yet</p>
              )}
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setActiveGroup(g); setGroupMenuOpen(false) }}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left',
                    activeGroup?.id === g.id
                      ? 'bg-violet-50 text-violet-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-xs shrink-0">
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{g.name}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => { navigate('/onboarding'); setGroupMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-violet-600 hover:bg-violet-50 transition-colors text-left"
                >
                  + Create new group
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? 'text-violet-600' : 'text-gray-400'}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {avatarLetter}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
