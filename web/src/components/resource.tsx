import {
  ResourceCollection,
  Resource as ResourceType,
  userDataAtom,
} from '@/state'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import ResourceAccordion from './resourceCollection'
import lengthMeasurementCompact from '@/assets/redesign/medical/dilator-length-measurement-compact--p28.svg'
import lengthMeasurementWide from '@/assets/redesign/medical/dilator-length-measurement-wide--p27.svg'
import therapyTimingWide from '@/assets/redesign/medical/therapy-timing-timeline-wide--p23.svg'
import therapyTimingVertical from '@/assets/redesign/medical/therapy-timing-timeline-vertical--p24.svg'
import dilatorSizeComparison from '@/assets/redesign/medical/dilator-size-comparison-wide--p21.svg'
import dilatorInsertionPosition from '@/assets/redesign/medical/dilator-insertion-position--p18.svg'
import dilatorInsertionArrow from '@/assets/redesign/medical/dilator-insertion-arrow--p19.svg'
import dilatorInsertionDuration from '@/assets/redesign/medical/dilator-insertion-duration--p20.svg'

const isLengthMeasurementHelp = (title: string, description?: string) => {
  const text = `${title} ${description ?? ''}`.toLowerCase()

  return (
    text.includes('vilken längd') ||
    text.includes('längd på stav') ||
    text.includes('längden') ||
    text.includes('length measurement')
  )
}

export function ResourceDrawer({
  resource,
  resourceCollection,
}:
  | { resource: ResourceType; resourceCollection?: undefined }
  | { resource?: undefined; resourceCollection: ResourceCollection }) {
  const title = resource?.title ?? resourceCollection!.name
  const showLengthMeasurement = isLengthMeasurementHelp(
    title,
    resource?.description ?? resourceCollection?.description
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          className="h-9 w-9 rounded-full bg-study-coral text-white hover:bg-study-coral/90"
          aria-label={`Visa hjälp: ${title}`}
        >
          <InfoCircledIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-hidden rounded-xl border-0 bg-white p-5 text-foreground sm:p-7">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="h-9 w-9" />
            <DialogTitle className="text-center text-2xl font-black leading-tight sm:text-3xl">
              {title}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-primary"
                aria-label="Stäng hjälp"
              >
                <Cross1Icon />
              </Button>
            </DialogClose>
          </div>
          <div className="mt-3 h-px w-full bg-foreground" />
        </DialogHeader>
        <div className="flex max-h-[74vh] flex-col items-center overflow-y-auto pt-4">
          {resource && <Resource resource={resource} />}
          {showLengthMeasurement && !resource && (
            <picture className="mt-5 block w-full">
              <source media="(min-width: 640px)" srcSet={lengthMeasurementWide} />
              <img
                src={lengthMeasurementCompact}
                alt="Illustration som visar hur vaginalstavens längd mäts."
                className="w-full"
              />
            </picture>
          )}
          {resourceCollection && (
            <div className="h-full w-full">
              <ResourceAccordion
                collection={resourceCollection}
                showHeader={false}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const replaceTextForUserType = (description: string, type: string) => {
  if (!description) return ''

  let processedText = description

  // Handle both encoded and regular <pre> tags - show for PRE users, hide for others
  if (type === 'PRE') {
    processedText = processedText
      .replace(/&lt;pre&gt;([\s\S]*?)&lt;\/pre&gt;/g, '$1')
      .replace(/<pre>([\s\S]*?)<\/pre>/g, '$1')
  } else {
    processedText = processedText
      .replace(/&lt;pre&gt;([\s\S]*?)&lt;\/pre&gt;/g, '')
      .replace(/<pre>([\s\S]*?)<\/pre>/g, '')
  }

  // Handle both encoded and regular <post> tags - show for POST users, hide for others
  if (type === 'POST') {
    processedText = processedText
      .replace(/&lt;post&gt;([\s\S]*?)&lt;\/post&gt;/g, '$1')
      .replace(/<post>([\s\S]*?)<\/post>/g, '$1')
  } else {
    processedText = processedText
      .replace(/&lt;post&gt;([\s\S]*?)&lt;\/post&gt;/g, '')
      .replace(/<post>([\s\S]*?)<\/post>/g, '')
  }

  return processedText
}

export default function Resource({ resource }: { resource: ResourceType }) {
  const userData = useAtomValue(userDataAtom)

  const description = replaceTextForUserType(
    resource.description,
    userData?.type ?? ''
  )

  if (resource.id === '8vegqnt3c9mpnu7') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="resource-content space-y-5 text-base font-semibold leading-snug text-foreground">
          <p>
            Vaginalstav används för att förebygga sammanläkning och ärrbildning
            i vagina.
          </p>
          <p>
            Syftet är att bibehålla så normal anatomi som möjligt. Detta för att
            kunna göra gynekologiska undersökningar och möjlighet att ha vaginalt
            sex.
          </p>
          <p>
            Vill du veta mer om hur strålbehandling kan påverka vaginal och
            sexuell hälsa och hur det kan förebyggas?
          </p>
          <p>Läs mer här:</p>
          <a
            href="https://eftercancern.se"
            className="inline-flex rounded-xl bg-study-header px-5 py-3 font-black text-foreground no-underline"
          >
            Användning av vaginalstav | Efter Cancern
          </a>
        </div>
      </Suspense>
    )
  }

  if (resource.id === '4mv1csl1xq95j2w') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="resource-content grid gap-4 text-base font-semibold leading-snug text-foreground sm:grid-cols-3">
          <img src={dilatorInsertionPosition} alt="" className="w-full" />
          <img src={dilatorInsertionArrow} alt="" className="w-full" />
          <img src={dilatorInsertionDuration} alt="" className="w-full" />
        </div>
      </Suspense>
    )
  }

  if (resource.id === 'therapy-timing-design') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="resource-content space-y-5 text-base font-semibold leading-snug text-foreground">
          <picture className="block w-full">
            <source media="(min-width: 640px)" srcSet={therapyTimingWide} />
            <img
              src={therapyTimingVertical}
              alt="Tidslinje för vaginalstavsterapi före, under och efter strålbehandling."
              className="w-full"
            />
          </picture>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-black">Före strålbehandling:</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Prova att använda vaginalstaven regelbundet</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-black">Under strålbehandling:</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Använd staven varje dag</li>
                <li>
                  Om det svider eller gör ont - pausa från terapin några dagar
                  eller veckor.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-black">Efter strålbehandling:</h3>
              <ul className="list-disc space-y-1 pl-6">
                <li>Fortsätt dagligen i 6 veckor</li>
                <li>Efter 6 veckor, gå över till 2-3 gånger dagligen</li>
                <li>Fortsätt regelbundet i 2-3 år</li>
              </ul>
            </div>
          </div>
        </div>
      </Suspense>
    )
  }

  if (resource.id === '540wnc1pz0k7v44') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="resource-content space-y-5 text-base font-semibold leading-snug text-foreground">
          <p>
            Använd den storlek som känns möjlig att föra in utan att det gör
            ont. Det viktiga är regelbundenheten, inte att välja största
            storleken.
          </p>
          <img
            src={dilatorSizeComparison}
            alt="Illustration som jämför vaginalstavarnas storlekar."
            className="w-full"
          />
        </div>
      </Suspense>
    )
  }

  if (isLengthMeasurementHelp(resource.title, description)) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="resource-content space-y-5 text-base font-semibold leading-snug text-foreground">
          <p>När du ska göra mätningen:</p>
          <p>
            Håll staven med din hand/fingrar invid slidans mynning. Titta på
            stavens längdmarkering och notera längden. Om du är osäker eller
            om greppet hamnar mitt emellan två markeringar - avrunda uppåt.
          </p>
          <picture className="block w-full">
            <source media="(min-width: 640px)" srcSet={lengthMeasurementWide} />
            <img
              src={lengthMeasurementCompact}
              alt="Illustration som visar vaginalstavens längdmarkeringar från 2 cm till 10 cm eller längre."
              className="w-full"
            />
          </picture>
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="resource-content [&_a]:text-primary [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_p]:font-light [&_p]:text-base"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></div>
    </Suspense>
  )
}
