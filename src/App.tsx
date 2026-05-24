import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GroupProvider } from './context/GroupContext'
import ProtectedRoute from './components/ProtectedRoute'
import GroupRoute from './components/GroupRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Bills from './pages/Bills'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Splits from './pages/Splits'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import JoinGroup from './pages/JoinGroup'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GroupProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Auth required */}
            <Route element={<ProtectedRoute />}>

              {/* Onboarding & join — auth required but no group needed */}
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/join/:code" element={<JoinGroup />} />

              {/* Group check — redirects to /onboarding if user has no group */}
              <Route element={<GroupRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/splits" element={<Splits />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

            </Route>
          </Routes>
        </GroupProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
