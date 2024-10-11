import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold">Välkommen till studien!</h1>
      <p className="mb-4">Tack så mycket för att du är med och deltar.</p>

      <p className="mb-4">
        För att komma igång så behöver du svara på ett initiellt formulär.
      </p>
      <Button>Sätt igång</Button>
    </div>
  )
}

export default HomePage
