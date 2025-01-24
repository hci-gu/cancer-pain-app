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

const QuestionNavigationList = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  const questions = useQuestions(questionnaire)
  const [_, setCurrentPage] = useAtom(formPageAtom)

  return (
    <Dialog>
      <DialogTrigger className="fixed top-16 right-8 z-50">
        <Button variant="outline">
          <ListBulletIcon className="mr-2" />
          Se alla frågor
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[50vw] max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2 mb-4">
            <h2 className="text-2xl font-semibold">Frågor</h2>
            <span className="text-md text-gray-500 font-light">
              Klicka på en fråga för att hoppa till den.
            </span>
          </DialogTitle>
          <DialogDescription className="h-full">
            <ScrollArea className="h-[60vh]">
              <ul className="space-y-2">
                {questions.map((question, index) => (
                  <DialogClose asChild>
                    <li
                      key={question.id}
                      onClick={() => {
                        setCurrentPage(index)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {question.type !== 'section' && (
                          <span className="text-gray-400 mr-2">
                            {question.number}.
                          </span>
                        )}
                        <Button
                          variant="link"
                          className="w-full text-left justify-start text-foreground hover:no-underline overflow-hidden text-ellipsis whitespace-nowrap"
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionNavigationList
