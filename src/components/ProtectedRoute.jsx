import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useUser()

  if (loading) return <Spinner />

  // Demo mode: DEMO_USER.isAuthenticated = true → always renders
  if (!user?.isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
