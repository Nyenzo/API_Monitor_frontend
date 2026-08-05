import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { AuthProvider } from '@/hooks/use-auth'
import { routeTree } from './routeTree.gen'

// Configure the query client with default caching and retry behavior
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

// Create the TanStack router from the auto-generated route tree
const router = createRouter({ routeTree })

// Register the router type for type-safe navigation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Root app component wrapping providers for queries, auth, and routing
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
