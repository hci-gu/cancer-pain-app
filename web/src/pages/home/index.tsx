import { Separator } from '@/components/ui/separator'
import InitialForm from './components/InitialForm'
import HomeTodoItem from './components/HomeTodoItem'
import { BoxIcon, CalendarIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

function HomePage() {
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
            className="hover:border hover:border-gray-300"
          >
            <InfoCircledIcon />
            <span className="mr-4">Läs på om studien</span>
          </HomeTodoItem>
        </Link>
        <HomeTodoItem index={3}>
          <BoxIcon />
          <p className="font-medium">Fyll i formulär</p>
        </HomeTodoItem>
        <HomeTodoItem index={4}>
          <CalendarIcon />
          <p className="font-medium">Dagligt formulär </p>
        </HomeTodoItem>
      </div>
    </div>
  )
}

export default HomePage
