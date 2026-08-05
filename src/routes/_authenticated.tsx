import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { AppShell } from '@/components/layout/app-shell'

// Layout route that guards all authenticated pages and redirects to login if no session exists
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppShell,
})
