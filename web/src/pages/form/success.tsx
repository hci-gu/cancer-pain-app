import { Button } from '@/components/ui/button'
import successIcon from '@/assets/redesign/status/success-check-circle--p55.svg'
import { Link } from 'react-router-dom'
import { ChevronDownIcon, ChevronUpIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { PinBottomIcon } from '@radix-ui/react-icons'

export default function FormSuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed left-0 top-0 z-40 flex h-20 w-screen items-center justify-between bg-study-header px-6 md:px-9">
        <div className="flex items-center gap-4 text-base font-bold">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-study-teal-dark text-white">
            <ListBulletIcon className="h-7 w-7" />
          </span>
          Se alla frågor
        </div>
      </div>

      <section className="flex min-h-screen w-full items-start justify-center px-0 pt-44 sm:px-8 md:px-16 md:pt-40">
        <div className="min-h-[24rem] w-full bg-white px-6 py-10 text-center sm:px-12 md:max-w-3xl md:px-16">
          <h1 className="text-3xl font-black leading-tight text-foreground">
            Tack för ditt svar!
          </h1>
          <div className="my-5 h-px w-full bg-foreground" />
          <div className="flex flex-col items-center gap-7">
            <p className="text-xl font-black">Din rapport är nu inskickad.</p>
            <img
              src={successIcon}
              alt=""
              aria-hidden="true"
              className="h-24 w-24"
            />
            <p className="max-w-2xl text-xl font-black leading-snug">
              Tack för att du rapporterat in din dagliga användning. Dina svar
              bidrar till viktig kunskap inom studien.
            </p>
            <Button asChild className="min-h-12 rounded-xl bg-primary px-6 text-base font-black text-foreground hover:bg-study-teal-dark hover:text-white">
              <Link to="/check-in">Stäng formuläret</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
        <Button
          type="button"
          disabled
          className="h-12 w-12 rounded-lg bg-study-coral p-0 text-white shadow-md disabled:opacity-100"
          aria-label="Föregående fråga"
        >
          <ChevronUpIcon />
        </Button>
        <Button
          type="button"
          disabled
          className="h-12 w-12 rounded-lg bg-study-header p-0 text-white shadow-md disabled:opacity-50"
          aria-label="Nästa fråga"
        >
          <ChevronDownIcon />
        </Button>
        <Button
          type="button"
          disabled
          className="h-12 w-12 rounded-lg bg-study-header p-0 text-white shadow-md disabled:opacity-50"
          aria-label="Sista frågan"
        >
          <PinBottomIcon />
        </Button>
      </div>
    </main>
  )
}
