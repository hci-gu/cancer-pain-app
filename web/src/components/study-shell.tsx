import { NavLink } from 'react-router-dom'
import { UserCircle } from 'lucide-react'
import { ReactNode } from 'react'
import preRtLogo from '@/assets/redesign/logos/pre-rt-logo--p56.svg'
import guSeal from '@/assets/redesign/logos/gothenburg-university-seal--p57.svg'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type BreadcrumbItemType = {
  label: string
  href?: string
}

type StudyAppShellProps = {
  children: ReactNode
  breadcrumbs?: BreadcrumbItemType[]
  variant?: 'page' | 'form'
}

const navItems = [
  { label: 'Hem', to: '/' },
  { label: 'Daglig koll', to: '/check-in' },
  { label: 'Info', to: '/about' },
  { label: 'Fragor & svar', to: '/faq' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'study-focus rounded-full px-3 py-2 text-sm font-extrabold text-foreground transition-colors hover:bg-white/35',
    isActive && 'bg-white/55'
  )

export function StudyFooter() {
  return (
    <footer className="w-full bg-study-header text-foreground">
      <div className="mx-auto flex w-full max-w-[912px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src={guSeal}
            alt="Goteborgs universitet"
            className="h-11 w-11 shrink-0"
          />
          <p className="max-w-lg text-sm font-bold leading-snug">
            Pre-RT studien ar ett samarbete mellan Goteborgs Universitet och
            Sahlgrenska
          </p>
        </div>
        <p className="text-sm">
          Kontakta{' '}
          <a
            href="mailto:linda.akeflo@gu.se"
            className="font-extrabold underline underline-offset-4"
          >
            Linda Akeflo
          </a>{' '}
          for mer information
        </p>
      </div>
    </footer>
  )
}

function StudyBreadcrumbs({ items }: { items: BreadcrumbItemType[] }) {
  if (items.length === 0) return null

  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <BreadcrumbItem key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <BreadcrumbLink asChild>
                  <NavLink to={item.href}>{item.label}</NavLink>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function StudyAppShell({
  children,
  breadcrumbs = [],
  variant = 'page',
}: StudyAppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 w-full border-b border-foreground/15 bg-study-header">
        <div className="mx-auto flex w-full max-w-[912px] flex-col gap-3 px-4 py-3 sm:px-8 md:flex-row md:items-center md:justify-between">
          <NavLink
            to="/"
            className="study-focus flex w-fit items-center gap-3 rounded-full"
          >
            <img src={preRtLogo} alt="Pre-RT" className="h-11 w-auto" />
          </NavLink>
          <nav
            aria-label="Huvudnavigation"
            className="flex flex-wrap items-center gap-1"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'study-focus ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/70 text-foreground transition-colors hover:bg-white/35',
                  isActive && 'bg-white/55'
                )
              }
              aria-label="Profil"
            >
              <UserCircle className="h-6 w-6" aria-hidden="true" />
            </NavLink>
          </nav>
        </div>
      </header>

      <main
        className={cn(
          'mx-auto w-full max-w-[912px] px-4 sm:px-8',
          variant === 'form' ? 'py-0' : 'py-8 md:py-10'
        )}
      >
        <div className="mx-auto w-full max-w-[760px]">
          <StudyBreadcrumbs items={breadcrumbs} />
          {children}
        </div>
      </main>

      <StudyFooter />
    </div>
  )
}
