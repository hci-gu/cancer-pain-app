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
import { Link, useNavigate } from 'react-router-dom'
import { startTransition } from 'react'

const QuestionnaireCard = ({
  questionaire,
}: {
  questionaire: Questionnaire
}) => {
  const answers = useAtomValue(answersForQuestionnaireAtom(questionaire.id))
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="text-xl">{questionaire.name}</CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p
            dangerouslySetInnerHTML={{
              __html: questionaire.description,
            }}
          ></p>
          <Button
            onClick={() => {
              startTransition(() => {
                navigate(`/forms/${questionaire.id}`)
              })
            }}
          >
            Start
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p>{answers.length} svar</p>
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
