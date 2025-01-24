import { Questionnaire } from '@/state'
import { useAtomValue } from 'jotai'
import { useWatch } from 'react-hook-form'
import { formPageAtom } from '../state'

const compare = (answer: any, dependencyValue: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(dependencyValue)
  }
  return answer === dependencyValue
}

const useQuestions = (questionnaire: Questionnaire) => {
  const values = useWatch()

  let questionNumber = 1
  const questions = questionnaire.questions
    .filter((question) => {
      if (question.dependency) {
        if (Array.isArray(question.dependencyValue)) {
          const [method, dependencyValue] = question.dependencyValue

          if (method == 'NOT') {
            return !compare(values[question.dependency], dependencyValue)
          }
        }

        return compare(values[question.dependency], question.dependencyValue)
      }
      return true
    })
    .map((question) => {
      if (question.type !== 'section') {
        question.number = questionNumber
        questionNumber++
      }
      return question
    })

  return questions
}

export const useCurrentSection = (questionnaire: Questionnaire) => {
  const questions = useQuestions(questionnaire)
  const page = useAtomValue(formPageAtom)
  const sectionIndexes = questions.reduce<number[]>((acc, question, index) => {
    if (question.type === 'section') {
      acc.push(index)
    }
    return acc
  }, [])

  const activeSectionIndex = sectionIndexes
    .filter((index) => index <= page)
    .pop()

  const question = questions[activeSectionIndex ?? -1]
  console.log(question)

  return question
}

export default useQuestions
