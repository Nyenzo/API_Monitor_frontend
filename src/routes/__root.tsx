import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/shared/error-boundary'

// Root route definition using TanStack Router
export const Route = createRootRoute({
  component: RootComponent,
})

// Root component that wraps the app with error boundary, tooltips, and toast notifications
function RootComponent() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Outlet />
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  )
}
