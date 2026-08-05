import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Activity, Loader2 } from 'lucide-react'

// Handles the Supabase password-recovery callback and lets the user set a new password.
// Supabase fires a PASSWORD_RECOVERY auth event when the user arrives via the reset link,
// which establishes a temporary session so updateUser can be called without re-authenticating.
export function ResetPasswordForm() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // Wait for Supabase to process the recovery token from the URL hash
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    // If the session is already active (token already exchanged), allow the form immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' })
      return
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      await updatePassword(password)
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' })
      navigate({ to: '/dashboard' })
    } catch (err: unknown) {
      toast({
        title: 'Could not update password',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 dot-pattern">
      <Card className="w-full max-w-sm animate-scale-in shadow-lg border-border/60">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="rounded-xl bg-primary p-2.5">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl tracking-tight">Set New Password</CardTitle>
            <CardDescription className="mt-1.5">
              {ready
                ? 'Choose a new password for your account.'
                : 'Verifying your reset link…'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {!ready ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
