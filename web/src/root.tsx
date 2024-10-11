import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'

const RootPage = () => {
  const location = useLocation()

  if (location.pathname.includes('/forms/')) {
    return <Outlet />
  }

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 sm:gap-4">
          <a href="/">Hem</a>
          <a href="/forms">Formulär</a>
        </nav>
      </header>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-11/12 md:w-1/2">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </>
  )
}
export default RootPage
