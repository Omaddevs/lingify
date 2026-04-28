import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import { useUser } from '../context/UserContext'
import { IS_DEMO } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useUser()

  if (user?.isAuthenticated) return <Navigate to="/" replace />

  return (
    <AuthLayout>
      <LoginForm isDemo={IS_DEMO} onSuccess={() => navigate('/')} />
    </AuthLayout>
  )
}
