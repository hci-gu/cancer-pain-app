import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { motion, interpolate } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import {
  answersForQuestionnaireAtom,
  formStateAtom,
  Questionnaire,
  questionnaireAtom,
  submitQuestionnaire,
} from '@/state'
import QuestionSelector from './components/QuestionSelector'
import { Form } from '@/components/ui/form'
import { useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PinBottomIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'
import useQuestions, { useCurrentSection } from './hooks/useQuestions'
import ReactPageScroller from 'react-page-scroller'
import { answeredUpTo, canProceedAtom, formPageAtom } from './state'
import { questionnaireAnswered } from '@/utils'
import useFormStateWithCache, {
  keyForQuestionnaire,
  SyncFormStateToLocalStorage,
  useScrollToLastAnsweredQuestion,
} from './hooks/useFormState'
import AbortButton from '../../components/ui/AbortButton'
import QuestionNavigationList from './components/QuestionNavigationList'
import { QUESTIONNAIRE_FOV_ID, QUESTIONNAIRE_PCL5_ID } from '@/constants'

const ProgressBar = ({ questionnaire }: { questionnaire: Questionnaire }) => {
  const questions = useQuestions(questionnaire)
  const page = useAtomValue(formPageAtom)
  const scaleX = interpolate([0, questions.length - 1], [0.01, 1])
  const showProgress = page >= 0

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-20 w-screen bg-study-header" />
      {showProgress && (
        <>
          <motion.div
            className="fixed left-1/2 top-28 z-40 h-4 w-64 -translate-x-1/2 overflow-hidden rounded-full bg-primary"
          >
            <motion.div
              className="h-full rounded-full bg-study-teal-dark"
              animate={{ scaleX: scaleX(page) }}
              transition={{ type: 'spring', duration: 0.4 }}
              style={{ originX: 0 }}
            />
          </motion.div>
          <motion.span className="fixed right-7 top-6 z-50 text-lg font-black text-foreground">
            {Math.min(page + 1, questions.length)}/{questions.length}
          </motion.span>
        </>
      )}
    </>
  )
}

const NavigationButtons = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const questions = useQuestions(questionnaire)
  const [page, setPage] = useAtom(formPageAtom)
  const answers = useWatch()
  const canScrollUpTo = useAtomValue(
    answeredUpTo({
      questions,
      answers,
    })
  )
  const canProceed = useAtomValue(
    canProceedAtom({
      questions,
      answers,
    })
  )

  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
      <Button
        className="h-12 w-12 rounded-lg bg-study-coral p-0 text-white shadow-md hover:bg-study-coral/90"
        disabled={page === 0}
        onClick={(e) => {
          e.preventDefault()
          setPage(page - 1)
        }}
      >
        <ChevronUpIcon />
      </Button>
      <Button
        className="h-12 w-12 rounded-lg bg-study-header p-0 text-white shadow-md hover:bg-study-header/90"
        disabled={canProceed}
        onClick={(e) => {
          e.preventDefault()
          setPage(page + 1)
        }}
      >
        <ChevronDownIcon />
      </Button>
      <Button
        className="h-12 w-12 rounded-lg bg-study-header p-0 text-white shadow-md hover:bg-study-header/90"
        disabled={canProceed}
        onClick={(e) => {
          e.preventDefault()
          setPage(canScrollUpTo)
        }}
      >
        <PinBottomIcon />
      </Button>
    </div>
  )
}

const Questions = ({
  questionnaire,
  loading,
  onSubmit,
}: {
  questionnaire: Questionnaire
  loading: boolean
  onSubmit: (data: any) => void
}) => {
  const [currentPage, setCurrentPage] = useAtom(formPageAtom)
  const questions = useQuestions(questionnaire)
  const answers = useWatch()

  const handlePageChange = (page: number) => {
    if (currentPage === -1 && page === 0) return
    setCurrentPage(page)
  }

  return (
    <div
      className="h-screen w-screen bg-background"
      style={{ position: 'absolute', overflow: 'hidden' }}
    >
      <ReactPageScroller
        containerHeight={'100vh'}
        pageOnChange={handlePageChange}
        customPageNumber={currentPage ?? 0}
        transitionTimingFunction="ease-in-out"
        animationTimer={200}
        animationTimerBuffer={200}
      >
        {questions.map((q, i) => (
          <QuestionSelector key={`Question_${q.id}_${i}`} question={q} />
        ))}
        <div className="flex h-full w-full items-center justify-center bg-background px-4 pt-24">
          <Button
            type="submit"
            disabled={loading}
            onClick={(_) => onSubmit(answers)}
          >
            {loading && <UpdateIcon className="animate-spin mr-2" />}
            Skicka in
          </Button>
        </div>
      </ReactPageScroller>
    </div>
  )
}

const QuestionnaireIntro = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const [, setPage] = useAtom(formPageAtom)
  const introHtml =
    questionnaire.introText && questionnaire.introText.trim().length > 0
      ? questionnaire.introText
      : questionnaire.description

  return (
    <section className="flex min-h-screen w-screen items-center justify-center bg-background px-4 pt-20">
      <div className="w-full max-w-3xl bg-card px-6 py-10 text-center shadow-sm sm:px-16">
        <h1 className="text-3xl font-black text-foreground">
          {questionnaire.name}
        </h1>
        <div className="my-6 h-px w-full bg-foreground" />
        <div
          className="resource-content mx-auto max-w-xl text-lg font-bold leading-snug text-foreground [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
        <Button
          type="button"
          className="mt-4"
          onClick={(event) => {
            event.preventDefault()
            setPage(0)
          }}
        >
          Gå vidare
        </Button>
      </div>
    </section>
  )
}

const SectionHandler = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const section = useCurrentSection(questionnaire)

  if (
    section &&
    (section.id === QUESTIONNAIRE_FOV_ID ||
      section.id.includes(QUESTIONNAIRE_PCL5_ID))
  ) {
    return (
      <>
        <div className="fixed top-4 md:top-auto md:bottom-4 md:left-4 p-2">
          <p className="text-xs text-center pb-2 invisible md:visible">
            Skapat av
          </p>
          <img
            src="/vgr-logo.png"
            alt="Västra Götalandsregionen"
            className="h-6 md:h-8"
          />
        </div>
        <AbortButton questionnaire={questionnaire} />
      </>
    )
  }

  return null
}

const InitiallyScrollToLastAnsweredQuestion = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  useScrollToLastAnsweredQuestion(questionnaire)

  return null
}

const LoadedForm = ({
  questionnaire,
  formSchema,
}: {
  questionnaire: Questionnaire
  formSchema: any
}) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const page = useAtomValue(formPageAtom)
  const form = useFormStateWithCache({
    questionnaire,
    formSchema,
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      // get date from query params
      const date = new URLSearchParams(window.location.search).get('date')

      await Promise.allSettled([
        await submitQuestionnaire(questionnaire.id, data, date),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ])
    } catch (e) {
      console.error(e)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      })
      setLoading(false)
      return
    }
    navigate('/form/success')
    toast({
      title: 'Inskickat',
      description: 'Ditt svar har skickats in.',
    })
    localStorage.removeItem(keyForQuestionnaire(questionnaire))

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className="min-h-screen bg-background text-foreground"
        onSubmit={(e) => e.preventDefault()}
      >
        <InitiallyScrollToLastAnsweredQuestion questionnaire={questionnaire} />
        <SyncFormStateToLocalStorage questionnaire={questionnaire} />
        <ProgressBar questionnaire={questionnaire} />
        <QuestionNavigationList questionnaire={questionnaire} />
        <SectionHandler questionnaire={questionnaire} />
        {page < 0 ? (
          <QuestionnaireIntro questionnaire={questionnaire} />
        ) : (
          <Questions
            questionnaire={questionnaire}
            loading={loading}
            onSubmit={onSubmit}
          />
        )}
        <NavigationButtons questionnaire={questionnaire} />
      </form>
    </Form>
  )
}

const FormPage = () => {
  const { id } = useParams()
  const schema = useAtomValue(formStateAtom(id ?? ''))
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))

  const answers = useAtomValue(answersForQuestionnaireAtom(questionnaire.id))
  const queryDate = new URLSearchParams(window.location.search).get('date')
  const date = queryDate ? new Date(queryDate) : new Date()

  const answered = questionnaireAnswered(questionnaire, answers, date)

  if (answered) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center">
          Du har redan svarat på det här formuläret. <br />
          <Button
            onClick={() => {
              window.history.back()
            }}
          >
            Gå tillbaka
          </Button>
        </p>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex justify-center items-center h-screen">
          <p className="text-center">
            Något gick fel med formuläret. <br />
            <Button
              onClick={() => {
                localStorage.removeItem(keyForQuestionnaire(questionnaire))
                // reload window
                window.location.reload()
              }}
            >
              Rensa svar
            </Button>
          </p>
        </div>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        {questionnaire && schema && (
          <LoadedForm questionnaire={questionnaire} formSchema={schema} />
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

export default FormPage
