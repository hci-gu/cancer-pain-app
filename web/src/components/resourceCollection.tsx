import { ResourceCollection } from '@/state'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { startTransition, useEffect, useState } from 'react'
import Resource from './resource'
import { Button } from './ui/button'
import { Cross1Icon } from '@radix-ui/react-icons'

export function ResourceCollectionDrawer({
  collection,
  buttonText,
}: {
  collection: ResourceCollection
  buttonText: string
}) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button>{buttonText}</Button>
      </DrawerTrigger>
      <DrawerContent className="sm:m-16 h-full">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerClose>
              <Button variant="outline" size="icon">
                <Cross1Icon />
              </Button>
            </DrawerClose>
            <DrawerTitle>{collection.name}</DrawerTitle>
            <div></div>
          </div>
        </DrawerHeader>
        <div className="p-8 overflow-y-scroll">
          <ResourceAccordion collection={collection} showHeader={false} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const titleToSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[åäàáâãæ]/g, 'a')
    .replace(/[öòóôõø]/g, 'o')
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/-+/g, '')
    .replace(/\s+/g, '-')
    .trim()

const ResourceSection = ({ text }: { text: string }) => {
  return (
    <div className="mb-4 bg-stone-800 text-center py-2">
      <h2 className="text-md font-bold text-white">{text.toUpperCase()}</h2>
    </div>
  )
}

export default function ResourceAccordion({
  collection,
  showHeader = true,
}: {
  collection: ResourceCollection
  showHeader?: boolean
}) {
  const [openResource, setOpenResource] = useState<string>(
    window.location.hash.replace('#', '')
  )

  useEffect(() => {
    const scrollTo = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const headerOffset = 100
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }
        }, 50)
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      startTransition(() => {
        setOpenResource(hash)
        scrollTo()
      })
    }

    scrollTo()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const resourceClicked = (value: string) => {
    startTransition(() => {
      window.location.hash = value
    })
  }

  return (
    <>
      {showHeader && <ResourceSection text={collection.name} />}
      <Accordion
        type="single"
        collapsible
        value={openResource}
        onValueChange={resourceClicked}
      >
        {collection.resources.map((resource, index) => (
          <AccordionItem
            value={titleToSlug(resource.title)}
            key={`Resource_${index}`}
            id={titleToSlug(resource.title)}
          >
            <AccordionTrigger className="text-lg mx-4">
              {resource.title}
            </AccordionTrigger>
            <AccordionContent className="shadow-inner px-4 py-8">
              <Resource resource={resource} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
