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
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  return (
    <Dialog>
      <DialogTrigger className="fixed left-6 top-4 z-50">
        <Button
          type="button"
          variant={isMobile ? 'link' : 'ghost'}
          className="gap-3 bg-transparent text-base font-bold text-foreground hover:bg-white/30"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-study-teal-dark text-white">
            <ListBulletIcon className="h-7 w-7" />
          </span>
          Se alla frågor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[86vh] w-[95vw] max-w-2xl overflow-hidden rounded-xl bg-background px-6 py-8 sm:w-[80vw]">
        <DialogHeader className="mb-4 flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-black">Frågor</h2>
          <div className="h-px w-full bg-foreground" />
          <span className="text-md font-medium">
            Klicka på en fråga för att hoppa till den.
          </span>
        </DialogHeader>
        <DialogDescription className="h-full">
          <ScrollArea className="h-[60vh]">
            <ul className="space-y-2">
              {questions.map((question, index) => (
                <DialogClose asChild key={`QuestionNavigator_${question.id}`}>
                  <li
                    onClick={() => {
                      setCurrentPage(index)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {question.type !== 'section' && (
                        <span className="text-foreground">
                          {question.number}.
                        </span>
                      )}
                      <Button
                        disabled={disabledAfter < index}
                        variant="link"
                        className={`
                          h-auto w-full justify-start rounded-xl px-3 py-2 text-left text-base text-foreground hover:no-underline overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer
                          ${index === page ? 'bg-study-header font-black' : 'font-bold'}
                        `}
                        dangerouslySetInnerHTML={{
                          __html: `${question.text}`,
                        }}
                      />
                    </div>
                    <Separator />
                  </li>
                </DialogClose>
              ))}
            </ul>
          </ScrollArea>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionNavigationList
