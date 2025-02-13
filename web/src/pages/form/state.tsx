import { Question } from '@/state'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const formPageAtom = atom(-1)

export const answeredUpTo = atomFamily(
  ({ questions, answers }: { questions: Question[]; answers: any }) =>
    atom((_) => {
      const requiredQuestions = questions
        // .filter((question) => question.required)
        .filter((question) => question.type !== 'section')
        .filter((question) => question.type !== 'text')
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

      if (indexesForRemainingQuestions.length === 0) {
        return questions.length
      }

      const canScrollUpTo = Math.min(...indexesForRemainingQuestions)
      return canScrollUpTo
    }),
  (a, b) =>
    a.questions.length === b.questions.length &&
    JSON.stringify(a.answers) === JSON.stringify(b.answers)
)

export const canProceedAtom = atomFamily(
  ({ questions, answers }: { questions: Question[]; answers: any }) =>
    atom((get) => {
      const page = get(formPageAtom)
      const canScrollUpTo = get(answeredUpTo({ questions, answers }))

      return page >= canScrollUpTo || page === questions.length
    }),
  (a, b) =>
    a.questions.length === b.questions.length &&
    JSON.stringify(a.answers) === JSON.stringify(b.answers)
)
