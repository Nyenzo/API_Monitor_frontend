import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

// Redirect authenticated users away — they don't need to reset if already signed in
export const Route = createFileRoute('/forgot-password')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
