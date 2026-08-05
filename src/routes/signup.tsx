import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { SignupForm } from '@/components/auth/signup-form'

// Signup route that redirects authenticated users to dashboard
export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignupPage,
})

// Renders the signup form page
function SignupPage() {
  return <SignupForm />
}
