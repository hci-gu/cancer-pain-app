import Pocketbase, { AuthModel } from 'pocketbase'
import { atomFamily, atomWithStorage, unwrap } from 'jotai/utils'
// @ts-ignore
import Cookies from 'js-cookie'
import { atom, useAtom } from 'jotai'
import { z } from 'zod'
import { dayStringFromDate } from './utils'
import { useEffect } from 'react'

export const pb = new Pocketbase(import.meta.env.VITE_API_URL)
// const IS_PROD = import.meta.env.VITE_API_URL.startsWith('https')
pb.autoCancellation(false)

export const authAtom = atomWithStorage<AuthModel | null>(
  'auth',
  null,
  {
    getItem: (key, initialValue) => {
      const cookie = Cookies.get(key)
      if (!cookie) return initialValue

      try {
        const parsedAuth = JSON.parse(cookie)
        pb.authStore.save(parsedAuth.token, parsedAuth.model)
        return pb.authStore.model
      } catch (error) {
        console.error('Error parsing auth cookie:', error)
        Cookies.remove(key)
        return initialValue
      }
    },
    setItem: (key, value) => {
      if (value) {
        const authData = {
          token: pb.authStore.token,
          model: pb.authStore.model,
        }
        Cookies.set(key, JSON.stringify(authData), {
          secure: false,
          expires: 90,
        })
      } else {
        Cookies.remove(key)
      }
    },
    removeItem: (key) => Cookies.remove(key),
  },
  { getOnInit: true }
)

export const userDataAtom = atom(async (get) => {
  const auth = get(authAtom)
  if (!auth) return null

  try {
    const response = await pb.collection('users').getOne(auth.id)
    return response
  } catch (e) {
    // throw out the auth token if the user doesn't exist
    Cookies.remove('auth')
    console.error(e)
    return null
  }
})

export const readAboutPageAtom = atomWithStorage<boolean>(
  'readAboutPage',
  false
)

export type Resource = {
  id: string
  title: string
  description: string
}

export type Question = {
  id: string
  text: string
  type:
    | 'text'
    | 'number'
    | 'painScale'
    | 'singleChoice'
    | 'multipleChoice'
    | 'date'
    | 'section'
  required: boolean
  placeholder?: string
  options: string[]
  dependency?: string
  dependencyValue?: any
  resource?: Resource
  number: number
}

export type Questionnaire = {
  id: string
  name: string
  description: string
  occurrence: 'daily' | 'weekly' | 'monthly' | 'once'
  questions: Question[]
}

export type Answer = {
  id: string
  user: string
  questionnaire: string
  answers: Record<string, any>
  created: string
  date: string
}

const mapQuestion = (question: any): Question => {
  return {
    id: question.id,
    text: question.text,
    type: question.type,
    required: question.required,
    placeholder: question.placeholder,
    options: question.expand?.options?.value,
    dependency: question.dependency,
    dependencyValue: question.dependencyValue,
    resource: question.expand?.resource,
    number: -1,
  }
}

const mapQuestionnaire = (questionnaire: any): Questionnaire => {
  return {
    id: questionnaire.id,
    name: questionnaire.name,
    description: questionnaire.description,
    occurrence: questionnaire.occurrence,
    questions: questionnaire.expand?.questions.map(mapQuestion) ?? [],
  }
}

const mapAnswer = (answer: any): Answer => {
  return {
    id: answer.id,
    user: answer.user,
    questionnaire: answer.questionnaire,
    answers: answer.answers,
    created: answer.created,
    date: answer.date,
  }
}

const questionnairesBaseAtom = atom<Promise<Questionnaire[]>>(async () => {
  const response = await pb.collection('questionnaires').getFullList({
    expand: 'questions',
  })

  return response.map(mapQuestionnaire)
})

export const questionnairesAtom = unwrap(questionnairesBaseAtom)

export const questionnaireAtom = atomFamily((id: string) =>
  atom(async () => {
    const response = await pb.collection('questionnaires').getOne(id, {
      expand: 'questions,questions.options,questions.resource',
    })

    return mapQuestionnaire(response)
  })
)

export const formStateAtom = atomFamily((id: string) =>
  atom(async (get) => {
    const questionnaire = await get(questionnaireAtom(id))

    const formSchema = z.object(
      questionnaire.questions.reduce((acc, q) => {
        switch (q.type) {
          case 'singleChoice':
            acc[q.id] = z.enum([q.options[0], ...q.options.slice(1)])
            break
          case 'multipleChoice':
            acc[q.id] = z.array(z.enum([q.options[0], ...q.options.slice(1)]))
            break
          case 'painScale':
            acc[q.id] = z.number().int().min(0).max(10)
            break
          case 'date':
            acc[q.id] = z.date()
            break
          default:
            acc[q.id] = q.type === 'text' ? z.string() : z.string().nullable()
        }

        if (!q.required) {
          acc[q.id] = acc[q.id].optional()
        }
        return acc
      }, {} as Record<string, z.ZodType<any>>)
    )

    return formSchema
  })
)

export const answersForQuestionnaireAtom = atomFamily((id: string) => {
  const dataAtom = atom<Answer[]>([])

  const fetchAtom = atom(null, async (_get, set) => {
    try {
      const response = await pb.collection('answers').getList(0, 100, {
        filter: `questionnaire = "${id}"`,
      })
      console.log(response)
      set(dataAtom, response.items.map(mapAnswer))
    } catch (e) {
      console.error(e)
      set(dataAtom, [])
    }
  })

  const combinedAtom = atom(
    (get) => get(dataAtom),
    (_get, set) => set(fetchAtom)
  )

  return combinedAtom
})

export const useAnswers = (questionnaireId: string) => {
  const [answers, refreshAnswers] = useAtom(
    answersForQuestionnaireAtom(questionnaireId)
  )

  useEffect(() => {
    if (questionnaireId) {
      refreshAnswers()
    }
  }, [questionnaireId, refreshAnswers])

  return answers
}

export const submitQuestionnaire = async (
  questionnaireId: string,
  answers: any,
  date: string | null = null
) => {
  const response = await pb.collection('answers').create({
    user: pb.authStore.model?.id,
    questionnaire: questionnaireId,
    answers,
    date: date ? new Date(date) : dayStringFromDate(new Date()),
  })
  return response
}
