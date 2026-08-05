import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Activity, Loader2, ArrowLeft } from 'lucide-react'

// Sends a Supabase password-reset email; shows a success state after submission
export function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: unknown) {
      toast({
        title: 'Could not send reset email',
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
            <CardTitle className="text-2xl tracking-tight">Reset Password</CardTitle>
            <CardDescription className="mt-1.5">
              {sent
                ? 'Check your inbox for the reset link.'
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </div>
        </CardHeader>

        {!sent ? (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              A reset link was sent to <span className="font-medium text-foreground">{email}</span>.
              Check your inbox (and spam folder) and click the link to set a new password.
            </p>
          </CardContent>
        )}

        <CardFooter>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mx-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
