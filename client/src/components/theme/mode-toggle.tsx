import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          setTheme('light')
        }}
      >
        <SunIcon />
      </Button>
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          setTheme('dark')
        }}
      >
        <MoonIcon />
      </Button>
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation()
          setTheme('system')
        }}
      >
        <MonitorIcon />
      </Button>
    </div>
  )
}
