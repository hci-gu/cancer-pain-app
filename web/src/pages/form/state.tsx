import { Question } from '@/state'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const formPageAtom = atom(0)

export const canProceedAtom = atomFamily(
  ({ questions, answers }: { questions: Question[]; answers: any }) =>
    atom((get) => {
      console.log('questions', questions)
      console.log('answers', answers)

      const page = get(formPageAtom)

      const requiredQuestions = questions
        .filter((question) => question.required)
        .map((question) => question.id)

      const answeredQuestions = Object.keys(answers).filter(
        (key) => !!answers[key]
      )
      const remainingQuestions = requiredQuestions.filter(
        (question) => !answeredQuestions.includes(question)
      )
      const indexesForRemainingQuestions = remainingQuestions.map((question) =>
        questions.findIndex((q) => q.id === question)
      )
      const canScrollUpTo = Math.min(...indexesForRemainingQuestions)
      console.log('canScrollUpTo', canScrollUpTo)

      return page >= canScrollUpTo
    }),
  (a, b) =>
    a.questions.length === b.questions.length &&
    JSON.stringify(a.answers) === JSON.stringify(b.answers)
)
