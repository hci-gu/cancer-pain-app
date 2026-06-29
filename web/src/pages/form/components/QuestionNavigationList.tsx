import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Questionnaire } from '@/state'
import { ListBulletIcon } from '@radix-ui/react-icons'
import useQuestions from '../hooks/useQuestions'
import { Separator } from '@/components/ui/separator'
import { useAtom } from 'jotai'
import { formPageAtom } from '../state'
import { useWatch } from 'react-hook-form'

const stripHtml = (html: string) => {
  const text =
    new DOMParser()
    .parseFromString(html, 'text/html')
    .documentElement.textContent ?? ''

  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const isFollowupQuestion = (id: string) =>
  id.startsWith('followup_') || id.split('_').length > 1

const DAILY_FORM_ID = 'sdzkpd49ndccf5b'
const DAILY_NAVIGATION_QUESTION_IDS = [
  'v3pcgtlpz9w3oh1',
  'lf5ya5abfuyb5uo',
  'mnp346hxbzcvy48',
  '1ztexj9r49nliqc',
  'yeea9whxqv2c1kq',
  '35loke6slz37910',
  'z39l2ubdri1evdx',
  'xxye1so1puvkwqd',
]

const QuestionNavigationList = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const questions = useQuestions(questionnaire)
  const [currentPage, setCurrentPage] = useAtom(formPageAtom)
  useWatch()
  let hasRenderedFollowupHeading = false
  const navigationQuestions =
    questionnaire.id === DAILY_FORM_ID
      ? DAILY_NAVIGATION_QUESTION_IDS.map((id) =>
        questionnaire.questions.find((question) => question.id === id)
      ).filter(Boolean)
      : questions

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="fixed left-6 top-0 z-50 h-20 gap-3 bg-transparent px-0 text-base font-bold leading-none text-foreground hover:bg-white/30 lg:left-4 lg:gap-2 lg:px-4 lg:text-sm"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-study-teal-dark text-white lg:h-8 lg:w-8">
            <ListBulletIcon className="h-7 w-7 lg:h-5 lg:w-5" />
          </span>
          Se alla frågor
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-3 top-auto flex h-[calc(100vh-5.25rem)] w-[calc(100vw-1.25rem)] max-w-md translate-y-0 flex-col overflow-hidden rounded-xl border-0 bg-background px-4 py-8 text-foreground sm:px-6 md:bottom-auto md:top-1/2 md:h-[min(42rem,calc(100vh-7rem))] md:w-[28.75rem] md:-translate-y-1/2">
        <DialogHeader className="mb-4 flex shrink-0 flex-col items-center gap-2 text-center">
          <DialogTitle className="text-3xl font-black leading-tight text-foreground">
            Frågor
          </DialogTitle>
          <div className="h-px w-full bg-foreground" />
          <DialogDescription className="text-md font-medium text-foreground">
            Klicka på en fråga för att hoppa till den.
          </DialogDescription>
        </DialogHeader>
        <div
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          data-question-navigation-scroll
        >
          <ul className="min-w-0 space-y-2 pr-2 text-foreground">
            {questionnaire.id === DAILY_FORM_ID && (
              <li className="px-3 pt-5 text-lg font-black text-foreground">
                Användning av vaginalstav
              </li>
            )}
            {navigationQuestions.map((question, index) => {
              if (!question) return null

              const visibleIndex = questions.findIndex(
                (visibleQuestion) =>
                  visibleQuestion.id === question.id ||
                  visibleQuestion.id.endsWith(`_${question.id}`)
              )
              const canNavigate = visibleIndex !== -1
              const disabled = false
              const text = stripHtml(question.text)
              const isFollowup = isFollowupQuestion(question.id)
              const showFollowupHeading =
                questionnaire.id === DAILY_FORM_ID
                  ? index === 2
                  : isFollowup && !hasRenderedFollowupHeading
              const isSelected = visibleIndex === currentPage
              const displayNumber =
                questionnaire.id === DAILY_FORM_ID
                  ? index + 1
                  : question.number

              if (showFollowupHeading) {
                hasRenderedFollowupHeading = true
              }

              if (question.type === 'section') {
                return (
                  <li
                    key={`QuestionNavigator_${question.id}`}
                    className="px-3 pt-5 text-lg font-black text-foreground"
                  >
                    {text}
                  </li>
                )
              }

              const row = (
                <li
                  className="min-w-0"
                  key={`QuestionNavigator_${question.id}`}
                >
                  {showFollowupHeading && (
                    <div className="px-3 pb-2 pt-5 text-lg font-black text-foreground">
                      Följdfrågor
                    </div>
                  )}
                  <Button
                    type="button"
                    disabled={disabled}
                    variant="link"
                    className={cn(
                      'h-auto w-full min-w-0 max-w-full justify-start overflow-hidden rounded-xl px-3 py-2 text-left text-base font-bold text-foreground hover:no-underline disabled:cursor-not-allowed disabled:opacity-40',
                      isSelected && 'bg-study-header'
                    )}
                    onClick={() => {
                      if (canNavigate) setCurrentPage(visibleIndex)
                    }}
                  >
                    <span className="mr-2 shrink-0">{displayNumber}.</span>
                    <span className="min-w-0 flex-1 truncate">{text}</span>
                  </Button>
                  <Separator className="mt-2" />
                </li>
              )

              if (disabled) return row

              return (
                <DialogClose asChild key={`QuestionNavigator_${question.id}`}>
                  {row}
                </DialogClose>
              )
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionNavigationList
