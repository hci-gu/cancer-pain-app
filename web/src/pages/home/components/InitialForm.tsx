import { Button } from '@/components/ui/button'
import { answersForQuestionnaireAtom, useAnswers } from '@/state'
import { BoxIcon, CheckboxIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeTodoItem from './HomeTodoItem'

const INITIAL_FORM_ID = 'muyb28eqa5xq39k'

function InitialForm() {
  const navigate = useNavigate()
  const answers = useAnswers(INITIAL_FORM_ID)

  if (answers.length > 0) {
    return (
      <HomeTodoItem index={1} background="bg-green-100">
        <CheckCircledIcon className="text-green-600" />
        <span className="text-green-800 font-medium">
          Du har svarat på formuläret
        </span>
      </HomeTodoItem>
    )
  }

  return (
    <HomeTodoItem index={1}>
      <BoxIcon />
      <div className="flex items-center space-x-4">
        <p className="font-medium">
          Du har ett initiellt formulär att fylla i.
        </p>
        <Button
          onClick={() => {
            startTransition(() => {
              navigate(`/forms/${INITIAL_FORM_ID}`)
            })
          }}
        >
          Sätt igång
        </Button>
      </div>
    </HomeTodoItem>
  )
}

export default InitialForm
