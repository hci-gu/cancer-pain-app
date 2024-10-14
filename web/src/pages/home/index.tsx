import { Button } from '@/components/ui/button'
import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold">Välkommen till studien!</h1>
      <p className="mb-4">Tack så mycket för att du är med och deltar.</p>

      <p className="mb-4">
        För att komma igång så behöver du svara på ett initiellt formulär.
      </p>
      <Button
        onClick={() => {
          startTransition(() => {
            navigate(`/forms/muyb28eqa5xq39k`)
          })
        }}
      >
        Sätt igång
      </Button>
    </div>
  )
}

export default HomePage
