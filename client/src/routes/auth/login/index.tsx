import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { LoginForm } from '@/features/auth/components/login-form'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/auth/login/')({
  component: RouteComponent,
  validateSearch: loginSearchSchema,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirect={redirect}></LoginForm>
      </div>
    </div>
  )
}
