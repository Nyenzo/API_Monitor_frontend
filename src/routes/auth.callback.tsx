import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Route that Supabase redirects to after a successful OAuth flow
export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

// Waits for Supabase to exchange the OAuth code for a session then navigates to the dashboard
function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase JS automatically detects the `code` query param and exchanges it for a session.
    // onAuthStateChange fires SIGNED_IN once the exchange completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        void navigate({ to: '/dashboard' })
      } else if (event === 'SIGNED_OUT') {
        void navigate({ to: '/login' })
      }
    })

    // Fallback: if the session was already set before this component mounted
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) void navigate({ to: '/dashboard' })
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return <LoadingSpinner label="Completing sign in…" />
}
