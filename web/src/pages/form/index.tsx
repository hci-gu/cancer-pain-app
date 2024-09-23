import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Questionnaire, questionnairesAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { Link } from 'react-router-dom'

const FormPage = () => {
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
        {questionaires.state === 'loading' ? (
          <p>Loading...</p>
        ) : (
          questionaires.data.map((questionaire: Questionnaire) => (
            <Card key={questionaire.name}>
              <CardHeader className="text-xl">{questionaire.name}</CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: questionaire.description,
                    }}
                  ></p>
                  <Link to={`/form/${questionaire.id}`}>
                    <Button>Start</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}

export default FormPage
