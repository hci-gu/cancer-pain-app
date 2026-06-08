import { Button } from '@/components/ui/button'
import { CalendarDays, ClipboardList, Flag, History } from 'lucide-react'
import { Link } from 'react-router-dom'

const DAILY_FORM_ID = 'sdzkpd49ndccf5b'
const TREATMENT_END_FORM_ID = 'p8ow7xj8h4uuv43'

const items = [
  {
    title: 'Fyll i formular - idag',
    description: 'Oppna dagens dagliga formular.',
    href: `/forms/${DAILY_FORM_ID}`,
    icon: ClipboardList,
  },
  {
    title: 'Tidigare dagliga svar',
    description: 'Se tidigare dagar och oppna ett svar fran schemat.',
    href: `/forms/${DAILY_FORM_ID}/history`,
    icon: History,
  },
  {
    title: 'Behandlingsstart',
    description: 'Visas fran din registrerade behandlingsstart.',
    href: '/profile',
    icon: CalendarDays,
  },
  {
    title: 'Slutdatum for stralbehandling',
    description: 'Fyll i nar din stralbehandling ar avslutad.',
    href: `/forms/${TREATMENT_END_FORM_ID}`,
    icon: Flag,
  },
]

export default function CheckInPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">Daglig koll</h1>
        <p className="max-w-xl text-base font-medium text-muted-foreground">
          Har samlas dagliga formular och behandlingsdatum. Den fulla visuella
          check-in dashboarden byggs i nasta fas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className="study-focus rounded-xl"
            >
              <article className="flex min-h-36 flex-col justify-between rounded-xl border border-foreground/15 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Icon className="h-7 w-7" aria-hidden="true" />
                <div className="space-y-2">
                  <h2 className="text-lg font-black">{item.title}</h2>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      <Button asChild>
        <Link to="/">Till startsidan</Link>
      </Button>
    </div>
  )
}
