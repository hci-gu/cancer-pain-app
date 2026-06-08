import { Button } from '@/components/ui/button'
import { Questionnaire } from '@/state'
import { keyForQuestionnaire } from '../../pages/form/hooks/useFormState'
import { LogOut } from 'lucide-react'

const AbortButton = ({ questionnaire }: { questionnaire?: Questionnaire }) => {
  const onClick = () => {
    if (questionnaire) {
      localStorage.removeItem(keyForQuestionnaire(questionnaire))
    }
    location.replace('https://www.google.se')
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 md:bottom-4">
      <Button
        type="button"
        onClick={onClick}
        variant="destructive"
        className="h-12 rounded-lg bg-destructive px-4 text-sm font-black text-white shadow-md hover:bg-destructive/90"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Lämna genast
      </Button>
    </div>
  )
}

export default AbortButton
