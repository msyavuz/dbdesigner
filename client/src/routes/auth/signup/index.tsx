import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { SignupForm } from '@/features/auth/components/signup-form'

export const Route = createFileRoute('/auth/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </SignupForm>
      </div>
    </div>
  )
}
