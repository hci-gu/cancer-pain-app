import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

function WelcomePage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[440px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Välkommen till studien
        </h1>
        <p className="text-sm text-muted-foreground">
          Pre-RT är ett forskningsprojekt som syftar till att förbättra
          rådgivning och uppföljning av sexuell hälsa hos kvinnor efter
          strålbehandling mot bäckenområdet. Tidigare forskning har
          uppmärksammat att tidiga rehabiliteringsinsatser - prehabilitering -
          kan vara fördelaktigt inom andra områden och vi vill undersöka om det
          kan gälla även för att förebygga och rehabilitera vaginala
          förändringar som kan uppstå i samband med strålbehandling.
        </p>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        För att se dina svar behöver du logga in.
      </p>
      <Link to="/login" className={cn(buttonVariants())}>
        Logga in
      </Link>
    </div>
  )
}

export default WelcomePage
