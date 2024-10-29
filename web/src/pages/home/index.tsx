import { Separator } from '@/components/ui/separator'
import InitialForm from './components/InitialForm'
import HomeTodoItem from './components/HomeTodoItem'
import { BoxIcon, CalendarIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { authAtom } from '@/state'
import { startTransition } from 'react'

const BASELINE_FORM_ID = 'u6917wm639q1d01'

function HomePage() {
  const navigate = useNavigate()
  const auth = useAtomValue(authAtom)
  const dailyDescription = auth?.treatmentStart
    ? `Med start ${auth?.treatmentStart.slice(0, 10)}`
    : 'Ange'

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold">Välkommen till studien!</h1>
      <p className="mb-4">Tack så mycket för att du är med och deltar.</p>

      <Separator className="m-4" />

      <p className="mb-2">
        Nedan kan du se en överblick på vad du behöver göra under studiens tid.
      </p>
      <div className="flex flex-col gap-2">
        <InitialForm />
        <Link to="/about">
          <HomeTodoItem
            index={2}
            icon={<InfoCircledIcon />}
            title="Läs på om studien"
            description="Ta del av information om studien och dess syfte."
          />
        </Link>
        <Link
          to={`/forms/${BASELINE_FORM_ID}`}
          onClick={(e) => {
            e.preventDefault()
            startTransition(() => {
              navigate(`/forms/${BASELINE_FORM_ID}`)
            })
          }}
        >
          <HomeTodoItem
            index={3}
            icon={<BoxIcon />}
            title="Fyll i formulär om dig själv"
            description="Tar ca 10 minuter att fylla i."
          />
        </Link>
        <HomeTodoItem
          index={4}
          icon={<CalendarIcon />}
          title="Dagligt formulär"
          description={dailyDescription}
        />
      </div>
    </div>
  )
}

export default HomePage
