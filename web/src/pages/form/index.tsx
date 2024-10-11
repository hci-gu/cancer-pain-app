import { Suspense, useEffect, useState } from 'react'
import { motion, interpolate } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import {
  formStateAtom,
  Questionnaire,
  questionnaireAtom,
  submitQuestionnaire,
} from '@/state'
import QuestionSelector from './components/QuestionSelector'
import { Form } from '@/components/ui/form'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormStateDebugger from './components/FormDebugger'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'
import useQuestions from './hooks/useQuestions'
import ReactPageScroller from 'react-page-scroller'
import { canProceedAtom, formPageAtom } from './state'

const ProgressBar = ({ questionnaire }: { questionnaire: Questionnaire }) => {
  const questions = useQuestions(questionnaire)
  const page = useAtomValue(formPageAtom)
  const scaleX = interpolate([0, questions.length - 1], [0.01, 1])
  const [textColor, setTextColor] = useState('black')
  useEffect(() => {
    setTextColor(page > questions.length / 2 ? 'white' : 'black')
  }, [page])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 h-8 w-screen bg-blue-500 z-10"
        animate={{ scaleX: scaleX(page) }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{ originX: 0 }}
      />
      <span
        className={`fixed top-1 left-1/2 font-semibold z-10 text-${textColor}`}
      >
        {Math.min(page + 1, questions.length)} / {questions.length}
      </span>
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
  const canProceed = useAtomValue(
    canProceedAtom({
      questions,
      answers,
    })
  )

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2">
      <Button
        className="bg-blue-500 text-white py-6 rounded shadow-md"
        disabled={page === 0}
        onClick={(e) => {
          e.preventDefault()
          setPage(page - 1)
        }}
      >
        <ChevronUpIcon />
      </Button>
      <Button
        className="bg-blue-500 text-white py-6 rounded shadow-md"
        disabled={canProceed}
        onClick={(e) => {
          e.preventDefault()
          setPage(page + 1)
        }}
      >
        <ChevronDownIcon />
      </Button>
    </div>
  )
}

const Questions = ({ questionnaire }: { questionnaire: Questionnaire }) => {
  const [currentPage, setCurrentPage] = useAtom(formPageAtom)
  const questions = useQuestions(questionnaire)
  const answers = useWatch()
  const canProceed = useAtomValue(
    canProceedAtom({
      questions,
      answers,
    })
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleBeforePageChange = (page: number) => {
    console.log(page)
  }

  return (
    <div className="w-screen h-screen">
      <ReactPageScroller
        pageOnChange={handlePageChange}
        onBeforePageScroll={handleBeforePageChange}
        customPageNumber={currentPage}
        blockScrollDown={canProceed}
        animationTimer={600}
      >
        {questions.map((q, i) => (
          <QuestionSelector question={q} questionNumber={i + 1} />
        ))}
        <div className="h-full w-full flex items-center justify-center">
          <Button type="submit">Skicka in</Button>
        </div>
      </ReactPageScroller>
    </div>
  )
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
  const [_, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await Promise.allSettled([
        await submitQuestionnaire(questionnaire.id, data),
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
    navigate('/forms')
    toast({
      title: 'Submitted',
      description: 'The questionnaire was submitted successfully.',
    })

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProgressBar questionnaire={questionnaire} />
        {/* <FormStateDebugger /> */}
        <Questions questionnaire={questionnaire} />
        <NavigationButtons questionnaire={questionnaire} />
      </form>
    </Form>
  )
}

const FormPage = () => {
  const { id } = useParams()
  const schema = useAtomValue(formStateAtom(id ?? ''))
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {questionnaire && schema && (
        <LoadedForm questionnaire={questionnaire} formSchema={schema} />
      )}
    </Suspense>
  )
}

export default FormPage
