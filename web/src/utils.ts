import type { Answer, Questionnaire } from './state'

export const isSameDay = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const isWithinPeriod = (date: Date, startDate: Date, endDate: Date) => {
  if (isSameDay(date, startDate) || isSameDay(date, endDate)) return true
  return date >= startDate && date <= endDate
}

export const isSameWeek = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false

  const startOfWeek = (date: Date) => {
    const value = new Date(date)
    value.setHours(12, 0, 0, 0)
    value.setDate(value.getDate() - value.getDay())
    return value
  }

  return isSameDay(startOfWeek(a), startOfWeek(b))
}

export const isSameMonth = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export const dayStringFromDate = (date: Date) => {
  date.setHours(12)
  return date.toISOString().substr(0, 10)
}

export const questionnaireAnswered = (
  questionnaire: Questionnaire,
  allAnswers: Answer[],
  date: Date | null = null
) => {
  const answers = allAnswers.filter(
    (answer) => answer.questionnaire === questionnaire.id
  )

  switch (questionnaire.occurrence) {
    case 'once':
      return answers.length > 0
    case 'daily':
      return answers.some((answer) =>
        isSameDay(new Date(answer.date), date ?? new Date())
      )
    case 'weekly':
      return answers.some((answer) =>
        isSameWeek(new Date(answer.date), date ?? new Date())
      )
    case 'monthly':
      return answers.some((answer) =>
        isSameMonth(new Date(answer.date), date ?? new Date())
      )
    default:
      return false
  }
}
