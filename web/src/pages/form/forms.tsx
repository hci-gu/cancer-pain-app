import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Questionnaire, questionnairesAtom, useAnswers } from '@/state'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { startTransition } from 'react'

const QuestionnaireCard = ({
  questionaire,
}: {
  questionaire: Questionnaire
}) => {
  const answers = useAnswers(questionaire.id)
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
            <p className="font-light text-muted-foreground">
              {answers.length} svar
            </p>
          ) : (
            <p className="font-light text-muted-foreground">
              {answers.length ? 'Svarat' : 'Inte svarat'}
            </p>
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
    <div className="p-4">
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
    </div>
  )
}

export default FormsPage
