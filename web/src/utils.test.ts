import { describe, expect, it } from 'vitest'
import type { Answer, Questionnaire } from './state'
import {
  isSameDay,
  isSameMonth,
  isSameWeek,
  questionnaireAnswered,
} from './utils'

const questionnaire = (
  id: string,
  occurrence: Questionnaire['occurrence']
): Questionnaire => ({
  id,
  name: id,
  description: '',
  occurrence,
  questions: [],
  dependency: [],
})

const answer = (questionnaireId: string, date: string): Answer => ({
  id: `${questionnaireId}-${date}`,
  user: 'user',
  questionnaire: questionnaireId,
  answers: {},
  created: date,
  date,
})

describe('date period helpers', () => {
  it('compares day, week, and month periods', () => {
    expect(
      isSameDay(new Date('2026-07-07T08:00:00Z'), new Date('2026-07-07T20:00:00Z'))
    ).toBe(true)
    expect(isSameWeek(new Date('2026-07-05'), new Date('2026-07-11'))).toBe(true)
    expect(isSameWeek(new Date('2026-07-05'), new Date('2026-07-12'))).toBe(false)
    expect(isSameMonth(new Date('2026-07-01'), new Date('2026-07-31'))).toBe(true)
    expect(isSameMonth(new Date('2026-07-31'), new Date('2026-08-01'))).toBe(false)
  })
})

describe('questionnaireAnswered', () => {
  it('matches one-time questionnaires by any existing answer', () => {
    expect(
      questionnaireAnswered(questionnaire('baseline', 'once'), [
        answer('baseline', '2026-07-01'),
      ])
    ).toBe(true)
  })

  it('matches daily questionnaires by selected date', () => {
    expect(
      questionnaireAnswered(
        questionnaire('daily', 'daily'),
        [answer('daily', '2026-07-07')],
        new Date('2026-07-07T12:00:00Z')
      )
    ).toBe(true)
    expect(
      questionnaireAnswered(
        questionnaire('daily', 'daily'),
        [answer('daily', '2026-07-06')],
        new Date('2026-07-07T12:00:00Z')
      )
    ).toBe(false)
  })

  it('matches weekly and monthly questionnaires by selected period', () => {
    expect(
      questionnaireAnswered(
        questionnaire('weekly', 'weekly'),
        [answer('weekly', '2026-07-05')],
        new Date('2026-07-11T12:00:00Z')
      )
    ).toBe(true)
    expect(
      questionnaireAnswered(
        questionnaire('monthly', 'monthly'),
        [answer('monthly', '2026-07-01')],
        new Date('2026-07-31T12:00:00Z')
      )
    ).toBe(true)
  })

  it('ignores answers for other questionnaires', () => {
    expect(
      questionnaireAnswered(questionnaire('target', 'once'), [
        answer('other', '2026-07-01'),
      ])
    ).toBe(false)
  })
})
