import { Link } from '@tanstack/react-router'
import { Activity, ArrowRight, Braces, CheckCircle2, CircleAlert, GitCommitHorizontal, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Braces,
    title: 'Import the contract',
    description: 'Paste the OpenAPI document your team already maintains and select the few operations customers cannot afford to lose.',
  },
  {
    icon: GitCommitHorizontal,
    title: 'Name the deployment',
    description: 'Run the selected checks immediately after deploy and keep the decision connected to a release reference.',
  },
  {
    icon: ShieldCheck,
    title: 'Act on evidence',
    description: 'See the failing status, JSON field, and latency rather than discovering a broken integration through support.',
  },
]

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_75%_20%,hsl(var(--foreground)/0.1),transparent_30%),radial-gradient(circle_at_15%_0%,hsl(var(--muted-foreground)/0.12),transparent_28%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="rounded-lg bg-primary p-2 text-primary-foreground"><Activity className="h-4 w-4" /></span>
          API Monitor
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
          <Button asChild><Link to="/signup">Start verifying <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-24">
        <div className="animate-slide-up">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Release verification for public APIs</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">Know a release broke an API before your customers do.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">API Monitor turns a customer-critical OpenAPI contract into immediate production checks and stores the evidence with the deployment.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/signup">Create a release check <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Open your workspace</Link></Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Built for B2B SaaS teams whose integrations are part of the product.</p>
        </div>

        <div className="animate-slide-up rounded-2xl border border-border/80 bg-card/90 p-4 shadow-2xl shadow-foreground/10 [animation-delay:120ms]">
          <div className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Release decision</p>
                <p className="mt-1 font-mono text-sm">2026-09-17.2</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive"><CircleAlert className="h-4 w-4" /> Regressed</span>
            </div>
            <div className="space-y-3 py-5 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2.5"><span><strong>GET</strong> Customer profile</span><span className="text-success">Passed · 184ms</span></div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3"><div className="flex items-center justify-between"><span><strong>POST</strong> Create subscription</span><span className="font-medium text-destructive">Failed · HTTP 200</span></div><p className="mt-2 text-xs text-muted-foreground">Expected status 201, got 200</p></div>
              <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2.5"><span><strong>GET</strong> Invoice status</span><span className="text-success">Passed · 221ms</span></div>
            </div>
            <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" /> Evidence is stored with the release, not lost in a terminal scrollback.</div>
          </div>
        </div>
      </section>

      <section className="relative border-y bg-muted/35">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">A smaller, sharper workflow</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Not another uptime dashboard. A deploy decision with a reason.</h2></div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => <article key={title} className="rounded-xl border bg-card p-6 shadow-sm"><div className="flex items-center gap-3"><span className="font-mono text-sm text-muted-foreground">0{index + 1}</span><Icon className="h-5 w-5" /></div><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Customer-critical APIs deserve customer-critical checks</p><h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Turn the next deployment into evidence, not a hope.</h2><Button asChild size="lg" className="mt-8"><Link to="/signup">Start verifying <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></section>
    </main>
  )
}
