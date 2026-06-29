import ResourceAccordion from '@/components/resourceCollection'
import { Resource, ResourceCollection, resourceCollectionAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import sexualHealthBodyWide from '@/assets/redesign/faq-categories/sexual-health-body-card-wide--p53.svg'
import sexualHealthBodyCompact from '@/assets/redesign/faq-categories/sexual-health-body-card-compact--p54.svg'
import intimateCareWide from '@/assets/redesign/faq-categories/intimate-care-category-card-wide--p51.svg'
import intimateCareCompact from '@/assets/redesign/faq-categories/intimate-care-category-card-compact--p52.svg'

const capitalize = (text: string) =>
  text.length ? `${text[0].toLocaleUpperCase('sv-SE')}${text.slice(1)}` : text

const stripOmPrefix = (text: string) => capitalize(text.replace(/^Om\s+/i, ''))

const titleForCollection = (collection: ResourceCollection) => {
  if (collection.id === '94ze51rc8dz5oh6') return 'Frågor om sexuell hälsa'
  if (collection.id === '23s6oyiql5gc9qi') return 'Frågor om intimvård'
  return stripOmPrefix(collection.name)
}

const normalizeVaginalstavCollection = (
  collection: ResourceCollection
): ResourceCollection => {
  if (collection.id !== '1ei3zjui10q8q91') return collection

  const byId = new Map(collection.resources.map((resource) => [resource.id, resource]))
  const why = byId.get('8vegqnt3c9mpnu7')
  const how = byId.get('4mv1csl1xq95j2w')
  const size = byId.get('540wnc1pz0k7v44')
  const length = byId.get('v6uaw2lwupb43k1')
  const discomfort = byId.get('971931xhdhac75z')
  const pain = byId.get('0mo0p6jq95s71k0')

  const resources: Resource[] = []

  if (why) {
    resources.push({
      ...why,
      title: 'Varför ska jag använda vaginalstav?',
    })
  }

  if (how) resources.push({ ...how, title: how.title.trim() })

  resources.push({
    id: 'therapy-timing-design',
    title: 'När ska jag göra terapin?',
    description:
      '<p>Följ den rekommendation du fått av vården för när vaginalstavsterapin ska göras.</p>',
  })

  if (size) resources.push(size)

  if (length) {
    resources.push({
      ...length,
      title: 'Hur mäter jag längden på staven?',
    })
  }

  if (discomfort || pain) {
    resources.push({
      id: 'pain-discomfort-design',
      title: 'Är det normalt med smärta och obehag?',
      description: `${discomfort?.description ?? ''}${pain?.description ?? ''}`,
    })
  }

  return {
    ...collection,
    resources,
  }
}

const normalizeSexualHealthCollection = (
  collection: ResourceCollection
): ResourceCollection => {
  if (collection.id !== '94ze51rc8dz5oh6') return collection

  const byId = new Map(collection.resources.map((resource) => [resource.id, resource]))
  const what = byId.get('2m43w22dg11hw9x')
  const treatment = byId.get('i0y07b2txpy01z0')
  const myHealth = byId.get('sg7r3u1z24c50y9')

  return {
    ...collection,
    name: 'Frågor om sexuell hälsa',
    resources: [
      what && { ...what, title: 'Vad är sexuell hälsa?' },
      treatment && {
        ...treatment,
        title: 'Hur påverkas sexualiteten av behandlingen?',
      },
      myHealth && {
        ...myHealth,
        title: 'Hur påverkas min sexuella hälsa av behandlingen?',
      },
    ].filter(Boolean) as Resource[],
  }
}

const normalizeIntimateCareCollection = (
  collection: ResourceCollection
): ResourceCollection => {
  if (collection.id !== '23s6oyiql5gc9qi') return collection

  const care = collection.resources[0]

  return {
    ...collection,
    name: 'Frågor om intimvård',
    resources: [
      care && { ...care, title: 'Hur sköter jag bäst min intimvård?' },
      {
        id: 'intimate-blisters-design',
        title: 'Hur gör jag om jag får blåsor eller sår?',
        description:
          '<p>Kontakta vården om du får blåsor, sår eller besvär som inte går över.</p>',
      },
      {
        id: 'intimate-shaving-design',
        title: 'Kan jag raka könshåret?',
        description:
          '<p>Var försiktig med rakning om huden är irriterad. Undvik att raka över sår eller öm hud.</p>',
      },
    ].filter(Boolean) as Resource[],
  }
}

const normalizeCollectionForDesign = (collection: ResourceCollection) =>
  normalizeIntimateCareCollection(
    normalizeSexualHealthCollection(normalizeVaginalstavCollection(collection))
  )

const CategoryIllustration = ({ collectionId }: { collectionId: string }) => {
  if (collectionId === '94ze51rc8dz5oh6') {
    return (
      <picture className="block w-full overflow-hidden">
        <source media="(max-width: 640px)" srcSet={sexualHealthBodyCompact} />
        <img src={sexualHealthBodyWide} alt="" className="w-full" />
      </picture>
    )
  }

  if (collectionId === '23s6oyiql5gc9qi') {
    return (
      <picture className="block w-full overflow-hidden">
        <source media="(max-width: 640px)" srcSet={intimateCareCompact} />
        <img src={intimateCareWide} alt="" className="w-full" />
      </picture>
    )
  }

  return null
}

export default function FaqResourcePage() {
  const { collectionId } = useParams()
  const sourceCollection = useAtomValue(resourceCollectionAtom(collectionId ?? ''))
  const collection = normalizeCollectionForDesign(sourceCollection)
  const pageTitle = titleForCollection(collection)

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">{pageTitle}</h1>
      </div>
      <ResourceAccordion collection={collection} showHeader={false} />
      <CategoryIllustration collectionId={collection.id} />
    </div>
  )
}
