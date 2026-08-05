import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Activity,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useState } from 'react'

// Collapsible desktop sidebar with navigation links and active route highlighting
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/monitors', label: 'Monitors', icon: Activity },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex items-center h-14 px-4 border-b">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="rounded-lg bg-primary p-1.5 transition-transform duration-200 group-hover:scale-105">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight">API Monitor</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="mx-auto group">
            <div className="rounded-lg bg-primary p-1.5 transition-transform duration-200 group-hover:scale-105">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.to || currentPath.startsWith(item.to + '/')

          const linkContent = (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.to} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return linkContent
        })}
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
