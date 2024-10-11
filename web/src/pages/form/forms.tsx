import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  answersForQuestionnaireAtom,
  Questionnaire,
  questionnairesAtom,
} from '@/state'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { startTransition } from 'react'

const QuestionnaireCard = ({
  questionaire,
}: {
  questionaire: Questionnaire
}) => {
  const answers = useAtomValue(answersForQuestionnaireAtom(questionaire.id))
  const navigate = useNavigate()

  const answered = questionaire.occurrence == 'once' && answers.length > 0

  return (
    <Card className="mb-4">
      <CardHeader className="text-xl font-bold">{questionaire.name}</CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p
            dangerouslySetInnerHTML={{
              __html: questionaire.description,
            }}
          ></p>
          <Button
            disabled={answered}
            onClick={() => {
              startTransition(() => {
                navigate(`/forms/${questionaire.id}`)
              })
            }}
          >
            Svara
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-end">
          {questionaire.occurrence != 'once' ? (
            <p>{answers.length} svar</p>
          ) : (
            <p>{answers.length ? 'Svarat' : 'Inte svarat'}</p>
          )}
          {questionaire.occurrence != 'once' && (
            <Button
              variant={'secondary'}
              onClick={() => {
                startTransition(() => {
                  navigate(`/forms/${questionaire.id}/history`)
                })
              }}
            >
              Se tidigare svar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

const FormsPage = () => {
  const questionaires = useAtomValue(questionnairesAtom)

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Formulär</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4">
        {questionaires?.map((questionaire: Questionnaire) => (
          <QuestionnaireCard
            key={`QuestionnaireCard_${questionaire.id}`}
            questionaire={questionaire}
          />
        ))}
      </div>
    </>
  )
}

export default FormsPage
