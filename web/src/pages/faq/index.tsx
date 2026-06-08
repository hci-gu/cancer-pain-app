import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">Fragor och svar</h1>
        <p className="max-w-xl text-base font-medium text-muted-foreground">
          FAQ-oversikten ar registrerad som route. Kategorier och accordions
          byggs i FAQ-fasen.
        </p>
      </div>
      <Button asChild>
        <Link to="/faq/mer">Om du vill veta mer</Link>
      </Button>
    </div>
  )
}
