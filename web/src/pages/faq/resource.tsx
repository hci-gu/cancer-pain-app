import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ResourceAccordion from '@/components/resourceCollection'
import { resourceCollectionAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { Link, useParams } from 'react-router-dom'

export default function FaqResourcePage() {
  const { collectionId } = useParams()
  const collection = useAtomValue(resourceCollectionAtom(collectionId ?? ''))

  return (
    <div className="space-y-7">
      <Breadcrumb>
        <BreadcrumbList className="text-base font-bold">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Start</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/faq">Frågor och svar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{collection.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-2">
        <h1 className="text-4xl font-black md:text-5xl">{collection.name}</h1>
      </div>
      <ResourceAccordion collection={collection} showHeader={false} />
      <Button asChild variant="secondary">
        <Link to="/faq">Tillbaka till frågor och svar</Link>
      </Button>
    </div>
  )
}
