import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function FaqMorePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">Mer information</h1>
        <p className="max-w-xl text-base font-medium text-muted-foreground">
          Alla FAQ-resurser kommer att visas har i den senare FAQ-fasen.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link to="/faq">Tillbaka till fragor och svar</Link>
      </Button>
    </div>
  )
}
