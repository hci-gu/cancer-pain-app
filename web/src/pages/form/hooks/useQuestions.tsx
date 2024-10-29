import { Questionnaire } from '@/state'
import { useWatch } from 'react-hook-form'

const compare = (answer: any, dependencyValue: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(dependencyValue)
  }
  return answer === dependencyValue
}

const useQuestions = (questionnaire: Questionnaire) => {
  const values = useWatch()

  const questions = questionnaire.questions.filter((question) => {
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

  return questions
}

export default useQuestions
