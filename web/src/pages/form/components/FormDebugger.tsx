import { questionnaireAtom } from '@/state'
import { useAtomValue } from 'jotai'
import { useFormContext, useFormState, useWatch } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formPageAtom } from '../state'

const FormStateDebugger = () => {
  const { id } = useParams()
  const page = useAtomValue(formPageAtom)
  const questionnaire = useAtomValue(questionnaireAtom(id ?? ''))
  const { dirtyFields, isDirty, isSubmitting, touchedFields } = useFormState()
  const { control } = useFormContext()
  const formValues = useWatch({ control })
  return (
    <pre className="fixed right-2 top-2 p-4 bg-white border border-gray-200 shadow-lg text-sm z-50 h-100 w-800 overflow-scroll">
      <Tabs defaultValue="state" className="w-[600px] h-[400px]">
        <TabsList>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
        </TabsList>
        <TabsContent value="state">
          {page},
          {JSON.stringify(
            {
              dirtyFields,
              isDirty,
              isSubmitting,
              touchedFields,
              formValues,
            },
            null,
            2
          )}
        </TabsContent>
        <TabsContent value="form">
          {JSON.stringify(questionnaire, null, 2)}
        </TabsContent>
      </Tabs>
    </pre>
  )
}

export default FormStateDebugger
