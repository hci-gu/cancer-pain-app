import ResourceAccordion from '@/components/resourceCollection'
import { Resource, ResourceCollection, resourceCollectionAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'

const capitalize = (text: string) =>
  text.length ? `${text[0].toLocaleUpperCase('sv-SE')}${text.slice(1)}` : text

const stripOmPrefix = (text: string) => capitalize(text.replace(/^Om\s+/i, ''))

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

export default function FaqResourcePage() {
  const { collectionId } = useParams()
  const sourceCollection = useAtomValue(resourceCollectionAtom(collectionId ?? ''))
  const collection = normalizeVaginalstavCollection(sourceCollection)
  const pageTitle = stripOmPrefix(collection.name)

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-black md:text-4xl">{pageTitle}</h1>
      </div>
      <ResourceAccordion collection={collection} showHeader={false} />
    </div>
  )
}
