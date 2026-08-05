import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { LoginForm } from '@/components/auth/login-form'

// Login route that redirects authenticated users to dashboard
export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

// Renders the login form page
function LoginPage() {
  return <LoginForm />
}
