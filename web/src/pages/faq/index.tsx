import { Button } from '@/components/ui/button'
import { ResourceCollection, resourcesAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { Link } from 'react-router-dom'
import radiationWide from '@/assets/redesign/faq-categories/radiation-effects-wave-card-wide--p78.svg'
import radiationSquare from '@/assets/redesign/faq-categories/radiation-effects-wave-card-square--p84.svg'
import dilatorWide from '@/assets/redesign/faq-categories/vaginal-dilator-card-wide--p79.svg'
import dilatorSquare from '@/assets/redesign/faq-categories/vaginal-dilator-card-square--p85.svg'
import sexualWide from '@/assets/redesign/faq-categories/sexual-health-card-wide--p80.svg'
import sexualSquare from '@/assets/redesign/faq-categories/sexual-health-card-square--p86.svg'
import intimateWide from '@/assets/redesign/faq-categories/intimate-care-card-wide--p81.svg'
import intimateSquare from '@/assets/redesign/faq-categories/intimate-care-card-square--p87.svg'
import violenceWide from '@/assets/redesign/faq-categories/violence-card-wide--p82.svg'
import violenceSquare from '@/assets/redesign/faq-categories/violence-card-square--p88.svg'
import learnMoreWide from '@/assets/redesign/faq-categories/learn-more-card-wide--p83.svg'
import learnMoreSquare from '@/assets/redesign/faq-categories/learn-more-card-square--p89.svg'

const fallbackTiles = [
  { wide: radiationWide, square: radiationSquare },
  { wide: dilatorWide, square: dilatorSquare },
  { wide: sexualWide, square: sexualSquare },
  { wide: intimateWide, square: intimateSquare },
  { wide: violenceWide, square: violenceSquare },
]

const fallbackNames = [
  'Om strålbehandling och biverkningar',
  'Om användning av vaginalstav',
  'Om sexuell hälsa',
  'Om intimvård',
  'Om våld',
]

const designCollectionOrder = [
  '85071a5innq3o43',
  '1ei3zjui10q8q91',
  '94ze51rc8dz5oh6',
  '23s6oyiql5gc9qi',
  '7d5griw67n84z36',
]

const sortCollectionsForDesign = (collections: ResourceCollection[]) =>
  [...collections].sort((a, b) => {
    const aIndex = designCollectionOrder.indexOf(a.id)
    const bIndex = designCollectionOrder.indexOf(b.id)

    if (aIndex !== -1 || bIndex !== -1) {
      return (
        (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
        (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      )
    }

    return (a.sort ?? 999) - (b.sort ?? 999)
  })

const FaqTile = ({
  collection,
  index,
}: {
  collection?: ResourceCollection
  index: number
}) => {
  const fallback = fallbackTiles[index % fallbackTiles.length]
  const image = collection?.image ?? fallback.wide
  const label = collection?.name || fallbackNames[index] || 'Frågor och svar'

  return (
    <Link
      to={collection ? `/faq/${collection.id}` : '/faq/mer'}
      className="study-focus relative block aspect-[183/140] overflow-hidden rounded-xl bg-primary transition-transform hover:-translate-y-0.5 sm:aspect-[2.18/1]"
    >
      <picture>
        {!collection?.image && (
          <source media="(max-width: 640px)" srcSet={fallback.square} />
        )}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <span className="absolute inset-x-3 top-3 text-left text-base font-black leading-tight text-foreground sm:inset-x-4 sm:top-4 sm:text-center sm:text-xl">
        {label}
      </span>
    </Link>
  )
}

export default function FaqPage() {
  const collections = useAtomValue(resourcesAtom)
  const visibleCollections =
    collections.length > 0
      ? sortCollectionsForDesign(collections).slice(0, 5)
      : Array.from({ length: 5 }, () => undefined)

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-4xl font-black md:text-5xl">Frågor och svar</h1>
        <p className="max-w-xl text-lg font-bold leading-snug">
          Här hittar du frågor och svar kring sådant som berör sexuell hälsa
          kopplat till cancer och strålbehandling.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {visibleCollections.map((collection, index) => (
          <FaqTile
            key={collection?.id ?? `fallback-${index}`}
            collection={collection}
            index={index}
          />
        ))}
        <Link
          to="/faq/mer"
          className="study-focus relative block aspect-[183/140] overflow-hidden rounded-xl bg-study-pink transition-transform hover:-translate-y-0.5 sm:aspect-[2.18/1]"
        >
          <picture>
            <source media="(max-width: 640px)" srcSet={learnMoreSquare} />
            <img
              src={learnMoreWide}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <span className="absolute inset-x-3 top-3 text-left text-base font-black leading-tight text-foreground sm:inset-x-4 sm:top-4 sm:text-center sm:text-xl">
            Om du vill veta mer
          </span>
        </Link>
      </div>
      {collections.length > 5 && (
        <Button asChild variant="secondary">
          <Link to="/faq/mer">Visa alla frågor och svar</Link>
        </Button>
      )}
    </div>
  )
}
