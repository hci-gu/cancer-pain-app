import { StudyTaskCard } from '@/components/study-task-card'
import { useAnswers, userDataAtom } from '@/state'
import { useAtomValue } from 'jotai'
import registrationArtSquare from '@/assets/redesign/dashboard-cards/registration-card-square--p64.svg'
import registrationArtWide from '@/assets/redesign/dashboard-cards/registration-card-wide--p58.svg'
import initialQuestionnaireArtSquare from '@/assets/redesign/dashboard-cards/initial-questionnaire-card-square--p65.svg'
import initialQuestionnaireArtWide from '@/assets/redesign/dashboard-cards/initial-questionnaire-card-wide--p59.svg'
import studyInfoArtSquare from '@/assets/redesign/dashboard-cards/study-info-card-square--p66.svg'
import studyInfoArtWide from '@/assets/redesign/dashboard-cards/study-info-card-wide--p60.svg'
import faqArtSquare from '@/assets/redesign/dashboard-cards/faq-card-square--p67.svg'
import faqArtWide from '@/assets/redesign/dashboard-cards/faq-card-wide--p61.svg'
import dailyFormArtSquare from '@/assets/redesign/dashboard-cards/daily-form-card-square--p68.svg'
import dailyFormArtWide from '@/assets/redesign/dashboard-cards/daily-form-card-wide--p62.svg'
import afterTreatmentArtSquare from '@/assets/redesign/dashboard-cards/after-treatment-card-square--p69.svg'
import afterTreatmentArtWide from '@/assets/redesign/dashboard-cards/after-treatment-card-wide--p63.svg'

const BASELINE_FORM_ID = 'u6917wm639q1d01'

function HomePage() {
  const user = useAtomValue(userDataAtom)
  const baselineAnswers = useAnswers(BASELINE_FORM_ID)
  const baselineAnswered = baselineAnswers.length > 0
  const treatmentStart = user?.treatmentStart

  return (
    <div className="space-y-5">
      <section className="space-y-3 text-center">
        <p className="mx-auto max-w-xl text-base font-semibold leading-snug text-foreground">
          Tack för att du är med och deltar.
          <br />
          Nedan kan du se en överblick på vad du behöver göra under studiens
          tid.
        </p>
      </section>

      <section
        aria-label="Studieöversikt"
        className="grid grid-cols-2 gap-3 sm:gap-x-7 sm:gap-y-5"
      >
        <StudyTaskCard
          title="Registrera dig"
          illustration={registrationArtSquare}
          desktopIllustration={registrationArtWide}
          complete={Boolean(treatmentStart)}
        />

        <StudyTaskCard
          title="Inledande frågeformulär"
          illustration={initialQuestionnaireArtSquare}
          desktopIllustration={initialQuestionnaireArtWide}
          complete={baselineAnswered}
          href={baselineAnswered ? undefined : `/forms/${BASELINE_FORM_ID}`}
          titleClassName="max-w-[70%]"
        />

        <StudyTaskCard
          title="Läs om studien"
          illustration={studyInfoArtSquare}
          desktopIllustration={studyInfoArtWide}
          href="/about"
        />

        <StudyTaskCard
          title="Frågor & svar"
          illustration={faqArtSquare}
          desktopIllustration={faqArtWide}
          href="/faq"
          titleClassName="max-w-[78%]"
        />

        <StudyTaskCard
          title="Dagligt formulär"
          illustration={dailyFormArtSquare}
          desktopIllustration={dailyFormArtWide}
          href="/check-in"
        />

        <StudyTaskCard
          title="Efter strålbehandlingen"
          illustration={afterTreatmentArtSquare}
          desktopIllustration={afterTreatmentArtWide}
          disabled
          titleClassName="max-w-[76%] text-foreground"
        />
      </section>
    </div>
  )
}

export default HomePage
