import { describe, expect, it } from 'vitest'
import type { Question } from '@/state'
import { getAnsweredUpTo, getCanProceed } from './state'

const question = (id: string, type: Question['type']): Question => ({
  id,
  text: id,
  type,
  required: true,
  followup: [],
  number: -1,
})

describe('questionnaire navigation state helpers', () => {
  const questions = [
    question('intro_text', 'text'),
    question('intro_section', 'section'),
    question('first_required', 'singleChoice'),
    question('second_required', 'painScale'),
  ]

  it('ignores text and section pages when finding the first unanswered question', () => {
    expect(getAnsweredUpTo({ questions, answers: {} })).toBe(2)
  })

  it('returns the first unanswered required question index', () => {
    expect(
      getAnsweredUpTo({
        questions,
        answers: {
          first_required: 'Yes',
        },
      })
    ).toBe(3)
  })

  it('allows proceeding only while the next page is within answered bounds', () => {
    expect(
      getCanProceed({
        page: 2,
        questions,
        answers: {
          first_required: 'Yes',
        },
      })
    ).toBe(true)

    expect(
      getCanProceed({
        page: 3,
        questions,
        answers: {
          first_required: 'Yes',
        },
      })
    ).toBe(false)
  })

  it('returns question count when all required questions are answered', () => {
    expect(
      getAnsweredUpTo({
        questions,
        answers: {
          first_required: 'Yes',
          second_required: '7',
        },
      })
    ).toBe(questions.length)
  })
})
