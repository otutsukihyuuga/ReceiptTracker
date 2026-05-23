import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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
} from 'lucide-react'
import clsx from 'clsx'

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

        {/* Family Switcher */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-xs">
                J
              </div>
              <span className="text-gray-700 font-medium">Johnson Family</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
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
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Alex Johnson</p>
              <p className="text-xs text-gray-500 truncate">alex@family.com</p>
            </div>
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
              A
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
