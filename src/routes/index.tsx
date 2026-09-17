import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { LandingPage } from '@/components/marketing/landing-page'

// Authenticated users continue directly to their workspace; prospective users see the product workflow.
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LandingPage,
})
