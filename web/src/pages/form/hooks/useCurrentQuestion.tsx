import { questionnaireAtom } from '@/state'
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const useCurrentQuestion = () => {
  const { id } = useParams()
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))

  const [page, setPage] = useState(1)
  const { scrollYProgress } = useScroll()

  const progressValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, questionnaire.questions.length + 1]
  )
  const currentPage = useTransform(
    progressValue,
    (value) => Math.ceil(value) || 1
  )

  useMotionValueEvent(currentPage, 'change', (latest: number) => {
    setPage(Math.ceil(latest) || 1)
  })

  return page
}

export default useCurrentQuestion
