import { Button } from '@/components/ui/button'
import { Link, useParams } from 'react-router-dom'

export default function FaqResourcePage() {
  const { collectionId } = useParams()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-extrabold text-muted-foreground">
          Start &gt; Fragor och svar
        </p>
        <h1 className="text-3xl font-black md:text-4xl">FAQ-kategori</h1>
        <p className="max-w-xl text-base font-medium text-muted-foreground">
          Route for kategori <span className="font-bold">{collectionId}</span>{' '}
          ar registrerad. Resursinnehall byggs i FAQ-fasen.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link to="/faq">Tillbaka till fragor och svar</Link>
      </Button>
    </div>
  )
}
