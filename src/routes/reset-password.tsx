import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

// Public route — Supabase redirects here after the user clicks the reset-password email link.
// The recovery token is in the URL hash; the ResetPasswordForm component handles it.
export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return <ResetPasswordForm />
}
