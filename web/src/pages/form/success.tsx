import { Button } from '@/components/ui/button'
import successIcon from '@/assets/redesign/status/success-check-circle--p55.svg'
import { Link } from 'react-router-dom'

export default function FormSuccessPage() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center">
      <img src={successIcon} alt="" aria-hidden="true" className="h-28 w-28" />
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">Tack!</h1>
        <p className="max-w-sm text-base font-medium text-muted-foreground">
          Ditt svar har skickats in.
        </p>
      </div>
      <Button asChild>
        <Link to="/check-in">Fortsatt</Link>
      </Button>
    </div>
  )
}
