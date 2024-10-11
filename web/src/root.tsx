import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { PersonIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { authAtom } from './state'

const RootPage = () => {
  const location = useLocation()
  const auth = useAtomValue(authAtom)

  if (
    location.pathname.includes('/forms/') &&
    !location.pathname.includes('history')
  ) {
    return <Outlet />
  }

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-12">
        <nav className="w-full flex text-lg font-medium items-center md:gap-5 md:text-sm justify-between">
          <div className="flex gap-6">
            <a href="/">Hem</a>
            <a href="/forms">Formulär</a>
          </div>
          {auth && (
            <a
              href="/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-black"
            >
              <PersonIcon className="w-5 h-5" />
            </a>
          )}
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
