import { Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import {
  formStateAtom,
  Questionnaire,
  questionnaireAtom,
  submitQuestionnaire,
} from '@/state'
import useBlockScroll from './hooks/useBlockScroll'
import QuestionSelector from './components/QuestionSelector'
import { Form } from '@/components/ui/form'
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useCurrentQuestion from './hooks/useCurrentQuestion'
import FormStateDebugger from './components/FormDebugger'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'

const ProgressBar = ({ questions }: { questions: number }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const page = useCurrentQuestion()
  const [textColor, setTextColor] = useState('black')
  useEffect(() => {
    setTimeout(
      () => setTextColor(page > questions / 2 ? 'white' : 'black'),
      100
    )
  }, [page])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 h-8 w-screen bg-blue-500 z-10"
        style={{ scaleX, originX: 0 }}
      />
      <span
        className={`fixed top-1 left-1/2 font-semibold z-10 text-${textColor}`}
      >
        {page} / {questions}
      </span>
    </>
  )
}

const NavigationButtons = ({
  questionRefs,
}: {
  questionRefs: React.MutableRefObject<(HTMLElement | null)[]>
}) => {
  const currentQuestion = useCurrentQuestion()

  const scrollToQuestion = (questionNumber: number) => {
    const target = questionRefs.current[questionNumber - 1]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2">
      <Button
        className="bg-blue-500 text-white py-6 rounded shadow-md"
        disabled={currentQuestion === 1}
        onClick={() => scrollToQuestion(currentQuestion - 1)}
      >
        <ChevronUpIcon />
      </Button>
      <Button
        className="bg-blue-500 text-white py-6 rounded shadow-md"
        disabled={currentQuestion === questionRefs.current.length}
        onClick={() => scrollToQuestion(currentQuestion + 1)}
      >
        <ChevronDownIcon />
      </Button>
    </div>
  )
}

const ScrollBlocker = () => {
  useBlockScroll()
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const questionRefs = useRef<(HTMLElement | null)[]>([])

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
        <div
          className="h-screen w-screen snap-y snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <ScrollBlocker />
          <ProgressBar questions={questionnaire.questions.length + 1} />
          <FormStateDebugger />
          <NavigationButtons questionRefs={questionRefs} />
          {questionnaire.questions.map((q, i) => (
            <QuestionSelector
              key={`Question_${q.id}`}
              question={q}
              questionNumber={i + 1}
              refCallback={(el) => (questionRefs.current[i] = el)}
            />
          ))}
          <section className="h-screen flex items-center justify-center snap-start">
            <Button type="submit" disabled={loading}>
              {loading && <UpdateIcon className="animate-spin mr-2" />}
              Submit
            </Button>
          </section>
        </div>
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
