import { Questionnaire } from '@/state'
import { useWatch } from 'react-hook-form'

const useQuestions = (questionnaire: Questionnaire) => {
  const values = useWatch()

  const questions = questionnaire.questions.filter((question) => {
    if (question.dependency) {
      const dependencyValue = values[question.dependency]
      return dependencyValue === question.dependencyValue
    }
    return true
  })

  return questions
}

export default useQuestions
