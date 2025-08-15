import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/auth-client'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
