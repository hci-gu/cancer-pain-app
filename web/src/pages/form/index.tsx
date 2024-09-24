import { Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useParams } from 'react-router-dom'
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
  const scrollToQuestion = (index: number) => {
    const target = questionRefs.current[index]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    scrollToQuestion(1)
  }

  // Handle Previous button click
  const handlePrevious = () => {
    scrollToQuestion(0)
  }

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded shadow-md"
        onClick={handlePrevious}
      >
        Previous
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow-md"
        onClick={handleNext}
      >
        Next
      </button>
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const questionRefs = useRef<(HTMLElement | null)[]>([])

  const onSubmit = (data: any) => {
    submitQuestionnaire(questionnaire.id, data)
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
            <Button type="submit">Submit</Button>
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
