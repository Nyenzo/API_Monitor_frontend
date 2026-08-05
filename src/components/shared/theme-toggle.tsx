import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme, type Theme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Dropdown button to switch between light, dark, and system themes
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['light', 'dark', 'system'] as Theme[]).map((t) => (
          <DropdownMenuItem key={t} onClick={() => setTheme(t)} className="capitalize">
            {t === 'light' && <Sun className="mr-2 h-4 w-4" />}
            {t === 'dark' && <Moon className="mr-2 h-4 w-4" />}
            {t === 'system' && <Monitor className="mr-2 h-4 w-4" />}
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
