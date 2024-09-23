import { Outlet } from 'react-router-dom'

const RootPage = () => {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a href="/">Hem</a>
          <a href="/form">Formulär</a>
        </nav>
      </header>
      <div className="flex flex-col items-center justify-center mt-24">
        <div className="w-1/2">
          <Outlet />
        </div>
      </div>
    </>
  )
}
export default RootPage
