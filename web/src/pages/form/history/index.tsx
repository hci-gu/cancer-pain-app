import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Questionnaire, questionnaireAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'

const FormHistoryLoaded = ({
  questionnaire,
}: {
  questionnaire: Questionnaire
}) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/forms">Formulär</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{questionnaire.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

const FormHistoryPage = () => {
  const { id } = useParams()
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormHistoryLoaded questionnaire={questionnaire} />
    </Suspense>
  )
}

export default FormHistoryPage
