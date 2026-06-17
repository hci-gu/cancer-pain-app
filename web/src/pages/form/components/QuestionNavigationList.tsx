import { Button } from '@/components/ui/button'
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
import { ScrollArea } from '@/components/ui/scroll-area'
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

const QuestionNavigationList = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const questions = useQuestions(questionnaire)
  const [, setCurrentPage] = useAtom(formPageAtom)
  useWatch()
  let hasRenderedFollowupHeading = false

  return (
    <Dialog>
      <DialogTrigger asChild className="fixed left-6 top-4 z-50 md:left-4 md:top-2">
        <Button
          type="button"
          variant="ghost"
          className="gap-3 bg-transparent text-base font-bold text-foreground hover:bg-white/30 md:gap-2 md:text-sm"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-study-teal-dark text-white md:h-8 md:w-8">
            <ListBulletIcon className="h-7 w-7 md:h-5 md:w-5" />
          </span>
          Se alla frågor
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-3 top-auto h-[calc(100vh-5.25rem)] w-[calc(100vw-1.25rem)] max-w-md translate-y-0 overflow-hidden rounded-xl border-0 bg-background px-4 py-8 text-foreground sm:px-6 md:bottom-auto md:top-1/2 md:h-auto md:max-h-[86vh] md:w-[28.75rem] md:-translate-y-1/2">
        <DialogHeader className="mb-4 flex flex-col items-center gap-2 text-center">
          <DialogTitle className="text-3xl font-black leading-tight text-foreground">
            Frågor
          </DialogTitle>
          <div className="h-px w-full bg-foreground" />
          <DialogDescription className="text-md font-medium text-foreground">
            Klicka på en fråga för att hoppa till den.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full">
          <ScrollArea className="h-[60vh]">
            <ul className="space-y-2 text-foreground">
              {questionnaire.id === DAILY_FORM_ID && (
                <li className="px-3 pt-5 text-lg font-black text-foreground">
                  Användning av vaginalstav
                </li>
              )}
              {questions.map((question, index) => {
                const disabled = false
                const text = stripHtml(question.text)
                const isFollowup = isFollowupQuestion(question.id)
                const showFollowupHeading =
                  isFollowup && !hasRenderedFollowupHeading

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
                  <li key={`QuestionNavigator_${question.id}`}>
                    {showFollowupHeading && (
                      <div className="px-3 pb-2 pt-5 text-lg font-black text-foreground">
                        Följdfrågor
                      </div>
                    )}
                    <Button
                      type="button"
                      disabled={disabled}
                      variant="link"
                      className={`
                        h-auto w-full justify-start overflow-hidden rounded-xl px-3 py-2 text-left text-base text-foreground hover:no-underline disabled:cursor-not-allowed disabled:opacity-40
                        font-bold
                      `}
                      onClick={() => {
                        if (!disabled) setCurrentPage(index)
                      }}
                    >
                      <span className="mr-2 shrink-0">{question.number}.</span>
                      <span className="truncate">{text}</span>
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionNavigationList
