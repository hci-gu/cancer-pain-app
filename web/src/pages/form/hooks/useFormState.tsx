import type { Questionnaire } from '@/state'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useLayoutEffect, useRef } from 'react'
import { useSetAtom } from 'jotai'
import { formPageAtom } from '../state'
import useQuestions from './useQuestions'

export type QuestionnaireFormSchema = Parameters<typeof zodResolver>[0]

export const keyForQuestionnaire = (
  questionnaire: Questionnaire,
  date = new Date()
) => {
  switch (questionnaire.occurrence) {
    case 'daily': {
      const day = date.toISOString().split('T')[0]
      return `${questionnaire.id}-${day}`
    }
    case 'weekly': {
      // get the first day of the week
      const week = new Date(date)
      week.setDate(date.getDate() - date.getDay())
      return `${questionnaire.id}-${week.toISOString().split('T')[0]}`
    }
    case 'monthly':
      return `${questionnaire.id}-${date
        .toISOString()
        .split('-')
        .slice(0, 2)
        .join('-')}`
    case 'once':
    default:
      return questionnaire.id
  }
}

const getAnswersFromLocalStorage = (key: string) => {
  const answers = localStorage.getItem(key)
  return answers ? JSON.parse(answers) : {}
}

const useFormStateWithCache = ({
  questionnaire,
  formSchema,
}: {
  questionnaire: Questionnaire
  formSchema: QuestionnaireFormSchema
}) => {
  const key = keyForQuestionnaire(questionnaire)
  const answers = getAnswersFromLocalStorage(key)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: answers,
  })

  return form
}

export const useScrollToLastAnsweredQuestion = (
  questionnaire: Questionnaire
) => {
  const setPage = useSetAtom(formPageAtom)
  const questions = useQuestions(questionnaire)
  const key = keyForQuestionnaire(questionnaire)
  const answers = getAnswersFromLocalStorage(key)
  const initialized = useRef(false)

  useLayoutEffect(() => {
    if (initialized.current) return
    initialized.current = true

    if (Object.keys(answers).length === 0) {
      setPage(-1)
      return
    }

    let index = 0
    for (const question of questions) {
      if (
        !answers[question.id] &&
        question.type !== 'section' &&
        question.type !== 'text'
      ) {
        break
      }
      index++
    }
    setPage(index)
  }, [answers, questions, setPage])
}

export const SyncFormStateToLocalStorage = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const { control } = useFormContext()
  const values = useWatch({ control })

  const key = keyForQuestionnaire(questionnaire)

  if (questionnaire.occurrence === 'once') {
    localStorage.setItem(key, JSON.stringify(values))
  }

  return null
}

export default useFormStateWithCache
