import { readAboutPageAtom, resourcesAtom } from '@/state'
import { useAtomValue, useSetAtom } from 'jotai'
import { startTransition, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import Resource from '@/components/resource'

const titleToSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[åäàáâãæ]/g, 'a')
    .replace(/[öòóôõø]/g, 'o')
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/-+/g, '')
    .replace(/\s+/g, '-')
    .trim()

const Resources = () => {
  const collections = useAtomValue(resourcesAtom)
  const [openResource, setOpenResource] = useState<string>(
    window.location.hash.replace('#', '')
  )

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      startTransition(() => {
        setOpenResource(hash)
      })
    }

    // Only scroll on initial load if there's a hash
    const hash = window.location.hash.replace('#', '')
    if (hash) {
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
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const resourceClicked = (value: string) => {
    startTransition(() => {
      window.location.hash = value
    })
  }

  return (
    <div className="mt-8">
      {collections.map((collection) => (
        <>
          <h1 className="text-xl font-bold mb-4 mt-4">{collection.name}</h1>
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
                <AccordionTrigger>{resource.title}</AccordionTrigger>
                <AccordionContent>
                  <Resource resource={resource} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ))}
    </div>
  )
}

function AboutPage() {
  const setRead = useSetAtom(readAboutPageAtom)
  useEffect(() => {
    setRead(true)
  }, [])

  return (
    <div className="mx-4">
      <p>
        <strong>
          Syftet med studien är att undersöka vid vilken tidpunkt som det är
          mest optimalt att påbörja vaginalstavsanvändning för att begränsa
          vaginala förändringar som beror på strålbehandlingens effekter. Vi
          vill förstå hur vården kan utveckla information och uppföljning till
          kvinnor om metoder för att bibehålla vävnadens elasticitet och
          förhindra att sammanlänkning av slidlemhinnan sker.
        </strong>
      </p>
      <br></br>
      <h2 className="font-bold">Hur går studien till?</h2>
      <p>
        Undersökningen är en så kallad randomiserad kontrollerad studie. Det
        innebär att du som är studiedeltagare kommer att lottas till vilken
        grupp du kommer att ingå i. Grupp 1 startar med vaginalstavsanvändning
        före strålbehandlingsstart. Grupp 2 startar med vaginalstavsanvändning
        efter avslutad strålbehandling. Oavsett vilken grupp du hamnar i kommer
        du att få samma information och rådgivning och det som skiljer grupperna
        åt är vid vilken tidpunkt som man startar upp användning av vaginalstav.
      </p>
      <br></br>
      <p>
        Under studiens gång kommer du att få svara på enkäter vid fyra
        tillfällen under sammanlagt ett år samt fylla i dagbok under en
        åttaveckors-period. Enkäterna innehåller frågor om kvinnohälsa, sexuell
        hälsa, förlossning, menstruation och andra allmänna frågor. Dagboken
        innehåller korta frågor om du har använt vaginalstaven, och mätning av
        vaginal längd. Med hjälp av dina svar kan vi i sjukvården få mer kunskap
        och förbättra vårdens sätt att informera om och behandla vaginala
        förändringar samt påverkan på sexualitet i samband med en
        cancerbehandling.
      </p>
      <br></br>
      <p>
        Sexuell hälsa är ett grundbehov och en viktig del i många människors
        liv. Det kan vara oroande att få en påverkan på den sexuella hälsan. Vi
        ser på sexuell hälsa ur både ett fysiskt, psykiskt och psykosocialt
        perspektiv och vet att sexuell praktik (hur, när och med vem man har
        sex) formas av normer, genus och kultur.
      </p>
      <p>
        Inom ramen för forskningsprojektet utvecklar vi även digitala verktyg,
        det vill säga digitaliserad information via webbsida och mobilapp för
        att förbättra informationsvägarna för egenvårdsråd.
      </p>
      <Separator className="mt-4" />
      <Resources />
      <div style={{ height: '100vh' }}></div>
      <div className="h-64 w-full"></div>
      <div className="h-64 w-full"></div>
    </div>
  )
}

export default AboutPage
