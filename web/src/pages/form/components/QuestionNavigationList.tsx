import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Questionnaire } from '@/state'
import { ListBulletIcon } from '@radix-ui/react-icons'
import useQuestions from '../hooks/useQuestions'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAtom, useAtomValue } from 'jotai'
import { answeredUpTo, formPageAtom } from '../state'
import { useWatch } from 'react-hook-form'

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const isFollowupQuestion = (id: string) =>
  id.startsWith('followup_') || id.split('_').length > 1

const QuestionNavigationList = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const questions = useQuestions(questionnaire)
  const [page, setCurrentPage] = useAtom(formPageAtom)
  const answers = useWatch()
  const disabledAfter = useAtomValue(
    answeredUpTo({
      questions,
      answers,
    })
  )
  let hasRenderedFollowupHeading = false

  return (
    <Dialog>
      <DialogTrigger asChild className="fixed left-6 top-4 z-50">
        <Button
          type="button"
          variant="ghost"
          className="gap-3 bg-transparent text-base font-bold text-foreground hover:bg-white/30"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-study-teal-dark text-white">
            <ListBulletIcon className="h-7 w-7" />
          </span>
          Se alla frågor
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-3 top-auto max-h-[86vh] w-[calc(100vw-1.25rem)] max-w-2xl translate-y-0 overflow-hidden rounded-xl border-0 bg-background px-4 py-8 text-foreground sm:px-6 md:bottom-auto md:top-1/2 md:w-[80vw] md:-translate-y-1/2">
        <DialogHeader className="mb-4 flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-black">Frågor</h2>
          <div className="h-px w-full bg-foreground" />
          <span className="text-md font-medium">
            Klicka på en fråga för att hoppa till den.
          </span>
        </DialogHeader>
        <DialogDescription className="h-full">
          <ScrollArea className="h-[60vh]">
            <ul className="space-y-2 text-foreground">
              {questions.map((question, index) => {
                const disabled = disabledAfter < index
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
                        ${index === page ? 'bg-study-header font-black' : 'font-bold'}
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
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionNavigationList
