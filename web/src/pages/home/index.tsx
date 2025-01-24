import { Separator } from '@/components/ui/separator'
import InitialForm from './components/InitialForm'
import HomeTodoItem from './components/HomeTodoItem'
import { CalendarIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { readAboutPageAtom, userDataAtom } from '@/state'
import BaselineForm from './components/BaselineForm'

function HomePage() {
  const user = useAtomValue(userDataAtom)
  const hasReadAboutPage = useAtomValue(readAboutPageAtom)
  const dailyDescription = user?.treatmentStart
    ? `Med start ${user?.treatmentStart.slice(0, 10)}`
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
            done={hasReadAboutPage}
          />
        </Link>
        <BaselineForm />
        <HomeTodoItem
          index={4}
          icon={<CalendarIcon />}
          title="Dagligt formulär"
          description={dailyDescription}
        />
        <HomeTodoItem
          index={4}
          icon={<CalendarIcon />}
          title="Ange slutdatum för strålbehandling"
          description={'Du kommer få en påminnelse när det är dags'}
        />
      </div>
    </div>
  )
}

export default HomePage
