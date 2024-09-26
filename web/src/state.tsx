import Pocketbase, { AuthModel } from 'pocketbase'
import { atomFamily, atomWithStorage, unwrap } from 'jotai/utils'
// @ts-ignore
import Cookies from 'js-cookie'
import { atom } from 'jotai'
import { z } from 'zod'

export const pb = new Pocketbase(import.meta.env.VITE_API_URL)

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
          secure: true,
        })
      } else {
        Cookies.remove(key)
      }
    },
    removeItem: (key) => Cookies.remove(key),
  },
  { getOnInit: true }
)

export type Question = {
  id: string
  text: string
  type: 'text' | 'painScale' | 'singleChoice' | 'multipleChoice'
  required: boolean
  placeholder?: string
  options: string[]
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
    options: question.expand?.options.value,
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
      expand: 'questions,questions.options',
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
          case 'multipleChoice':
            acc[q.id] = z.enum([q.options[0], ...q.options.slice(1)])
            break
          case 'painScale':
            acc[q.id] = z.number().int().min(0).max(10)
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

export const answersForQuestionnaireAtom = atomFamily((id: string) =>
  atom(async () => {
    const response = await pb.collection('answers').getList(0, 100, {
      filter: `questionnaire = "${id}"`,
    })

    return response.items.map(mapAnswer)
  })
)

export const submitQuestionnaire = async (
  questionnaireId: string,
  answers: any
) => {
  const response = await pb.collection('answers').create({
    user: pb.authStore.model?.id,
    questionnaire: questionnaireId,
    answers,
  })
  return response
}
