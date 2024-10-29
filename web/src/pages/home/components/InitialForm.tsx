import { Button } from '@/components/ui/button'
import { useAnswers } from '@/state'
import { BoxIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeTodoItem from './HomeTodoItem'

const INITIAL_FORM_ID = 'muyb28eqa5xq39k'

function InitialForm() {
  const navigate = useNavigate()
  const answers = useAnswers(INITIAL_FORM_ID)

  if (answers.length > 0) {
    return (
      <HomeTodoItem
        index={1}
        icon={<CheckCircledIcon className="text-green-600" />}
        title="Du har angett behandlingsstart."
        done
      />
    )
  }

  return (
    <HomeTodoItem
      index={1}
      icon={<BoxIcon />}
      title="Använd formuläret för att anmäla behandlingsstart."
      action={
        <Button
          onClick={() => {
            startTransition(() => {
              navigate(`/forms/${INITIAL_FORM_ID}`)
            })
          }}
        >
          Sätt igång
        </Button>
      }
    />
  )
}

export default InitialForm
