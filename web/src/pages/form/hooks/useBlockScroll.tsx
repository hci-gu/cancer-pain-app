import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import useCurrentQuestion from './useCurrentQuestion'
import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { questionnaireAtom } from '@/state'

export default function useBlockScroll() {
  const { id } = useParams()
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))
  const values = useWatch()

  const questionNumber = useCurrentQuestion()

  const requiredQuestions = questionnaire.questions
    .filter((question) => question.required)
    .map((question) => question.id)

  const answeredQuestions = Object.keys(values).filter((key) => !!values[key])

  const remainingQuestions = requiredQuestions.filter(
    (question) => !answeredQuestions.includes(question)
  )
  const indexesForRemainingQuestions = remainingQuestions.map((question) =>
    questionnaire.questions.findIndex((q) => q.id === question)
  )
  const canScrollUpTo = Math.min(...indexesForRemainingQuestions)

  const handleWheel = (e: WheelEvent) => {
    if (questionNumber >= canScrollUpTo + 1 && e.deltaY > 0) {
      e.preventDefault()
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (questionNumber >= canScrollUpTo + 1 && e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    // Add the event listener with { passive: false }
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeydown, { passive: false })

    return () => {
      // Clean up event listener when component unmounts
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleWheel, questionNumber])

  return null
}
