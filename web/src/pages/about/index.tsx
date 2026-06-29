import { readAboutPageAtom } from '@/state'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function AboutPage() {
  const setRead = useSetAtom(readAboutPageAtom)
  useEffect(() => {
    setRead(true)
  }, [setRead])

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        <h1 className="text-2xl font-black leading-tight md:text-4xl">
          Information om studien
        </h1>
        <div className="space-y-5 text-base font-semibold leading-snug md:text-lg md:font-bold">
          <p>
            Syftet med studien är att undersöka vid vilken tidpunkt som det är
            mest optimalt att påbörja vaginalstavsanvändning för att begränsa
            vaginala förändringar som beror på strålbehandlingens effekter.
          </p>
          <p>
            Vi vill förstå hur vården kan utveckla information och uppföljning
            till kvinnor om metoder för att bibehålla vävnadens elasticitet och
            förhindra att sammanlänkning av slidlemhinnan sker.
          </p>
        </div>
      </section>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="how" className="border-0">
          <AccordionTrigger className="rounded-xl bg-primary px-5 py-4 text-left text-xl font-black text-foreground hover:no-underline">
            Hur går studien till?
          </AccordionTrigger>
          <AccordionContent className="mt-2 rounded-xl bg-white px-5 py-5 text-base font-bold leading-relaxed">
            Undersökningen är en så kallad observationsstudie. Du som
            studiedeltagare startar vaginalstavsterapin före strålstart istället
            för efter avslutad strålbehandling, vilket är praxis idag.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="why" className="border-0">
          <AccordionTrigger className="rounded-xl bg-primary px-5 py-4 text-left text-xl font-black text-foreground hover:no-underline">
            Varför ska jag svara på frågorna?
          </AccordionTrigger>
          <AccordionContent className="mt-2 rounded-xl bg-white px-5 py-5 text-base font-bold leading-relaxed">
            Dina svar hjälper oss att få mer kunskap och förfina metoden för att
            förebygga vaginala förändringar och påverkan på sexuell hälsa i
            samband med cancerbehandling.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section className="bg-[#f8e6b8] px-5 py-6 text-foreground">
        <h2 className="mb-5 text-2xl font-black">Kontakt (vardagar 08-16)</h2>
        <div className="grid gap-5 text-base font-bold leading-snug sm:grid-cols-2">
          <div>
            <p>Forskningssjuksköterska</p>
            <p>Therese Alm</p>
            <p>Specialistsjuksköterska i onkologi</p>
            <p>Tel: 031-343 98 56 (telefonsvarare)</p>
            <p>E-post: therese.alm@vgregion.se</p>
          </div>
          <div>
            <p>Studieansvarig forskare</p>
            <p>Linda Åkeflo</p>
            <p>Med.dr och legitimerad sjuksköterska</p>
            <p>Tel: 031-786 61 59</p>
            <p>E-post: linda.akeflo@gu.se</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
