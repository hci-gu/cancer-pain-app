import Pocketbase, { AuthModel } from 'pocketbase'
import { atomFamily, atomWithStorage, loadable } from 'jotai/utils'
import Cookies from 'js-cookie'
import { atom } from 'jotai'

export const pb = new Pocketbase('http://localhost:8090')

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
          sameSite: 'strict',
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
  text: string
  type: 'text' | 'painScale'
  placeholder?: string
}

export type Questionnaire = {
  id: string
  name: string
  description: string
  occurrence: 'daily' | 'weekly' | 'monthly' | 'once'
  questions: Question[]
}

const questionnairesBaseAtom = atom<Promise<Questionnaire[]>>(async () => {
  const response = await pb.collection('questionnaires').getFullList({
    expand: 'questions',
  })

  return response.map((questionnaire) => ({
    id: questionnaire.id,
    name: questionnaire.name,
    description: questionnaire.description,
    occurrence: questionnaire.occurrence,
    questions: questionnaire.expand?.questions as Question[],
  })) as Questionnaire[]
})

export const questionnairesAtom = loadable(questionnairesBaseAtom)
