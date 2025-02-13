import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CustomDay, LargeCalendar } from '@/components/ui/calendar'
import {
  Answer,
  Questionnaire,
  questionnaireAtom,
  useAnswers,
  userDataAtom,
} from '@/state'
import { CheckIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { startTransition, Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dayStringFromDate, isSameDay, isWithinPeriod } from '@/utils'
import { DayProps } from 'react-day-picker'

const FormHistoryLoaded = ({
  questionnaire,
  answers,
  startDate,
}: {
  questionnaire: Questionnaire
  answers: Answer[]
  startDate: Date | null
}) => {
  const navigate = useNavigate()
  const now = new Date()

  return (
    <div className="px-8">
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

      <LargeCalendar
        className="m-0 mt-8 p-0"
        disabled={{ after: new Date(), before: startDate ?? new Date() }}
        onDayRender={(props: DayProps) => {
          if (isSameDay(props.date, startDate)) {
            return (
              <CustomDay
                {...props}
                onClick={() => {}}
                style={{
                  color: '#dc2626',
                  fontWeight: 'bold',
                  border: '2px solid #dc2626',
                }}
              >
                <span>Start</span>
              </CustomDay>
            )
          }

          if (answers.some((a) => isSameDay(new Date(a.date), props.date))) {
            return (
              <CustomDay
                {...props}
                // onClick={() => alert(props.date)}
                style={{
                  color: '#16a34a',
                  fontWeight: 'bold',
                  border: '2px solid #16a34a',
                }}
              >
                <span>
                  <CheckIcon className="w-5 h-5" />
                </span>
              </CustomDay>
            )
          }

          if (isWithinPeriod(props.date, startDate ?? now, now)) {
            return (
              <CustomDay {...props}>
                <Button
                  className="px-2 py-1 mt-1"
                  onClick={() =>
                    startTransition(() => {
                      navigate(
                        `/forms/${questionnaire.id}?date=${dayStringFromDate(
                          props.date
                        )}`
                      )
                    })
                  }
                >
                  svara
                </Button>
              </CustomDay>
            )
          }

          return <CustomDay {...props} />
        }}
      />
    </div>
  )
}

const FormHistoryPage = () => {
  const { id } = useParams()
  const userData = useAtomValue(userDataAtom)
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))
  const answers = useAnswers(questionnaire.id ?? '')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormHistoryLoaded
        questionnaire={questionnaire}
        answers={answers}
        startDate={
          userData?.treatmentStart ? new Date(userData.treatmentStart) : null
        }
      />
    </Suspense>
  )
}

export default FormHistoryPage
