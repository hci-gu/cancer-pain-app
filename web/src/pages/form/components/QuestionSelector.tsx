import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Question } from '@/state'
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form'
import { useSetAtom } from 'jotai'
import { formPageAtom } from '../state'
import { DatePicker } from '@/components/ui/date-picker'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import Select from './Select'
import { ResourceDrawer } from '@/components/resource'

const renderQuestionType = (
  question: Question,
  field: ControllerRenderProps<FieldValues, any>,
  onAnswer: (value: any) => void
) => {
  const options = question.options?.value
  const optionInputRefs = useRef<(HTMLInputElement | null)[]>(
    options?.map(() => null) ?? []
  )

  switch (question.type) {
    case 'text':
    case 'number':
      return (
        <Input
          placeholder={
            question.placeholder && question.placeholder.length > 0
              ? question.placeholder
              : 'Valfri kommentar'
          }
          type={question.type}
          enterKeyHint="done"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const target = e.target as HTMLInputElement
              target.blur()
              onAnswer(e)
            }
          }}
          {...field}
        />
      )
    case 'painScale':
      return (
        <RadioGroup
          onValueChange={(value) => {
            field.onChange(value)
            onAnswer(value)
          }}
          defaultValue={field.value}
          className="flex flex-wrap"
        >
          {Array.from({ length: 11 }).map((_, index) => (
            <FormItem className="flex items-center space-x-3 space-y-0 flex-wrap">
              <FormControl>
                {/* @ts-ignore */}
                <RadioGroupItem value={index} />
              </FormControl>
              <FormLabel className="font-normal">{index}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )
    case 'singleChoice':
    case 'multipleChoice':
      return (
        <Select
          question={question}
          field={field}
          onAnswer={onAnswer}
          optionInputRefs={optionInputRefs}
        />
      )
    case 'date':
      return (
        <DatePicker
          date={field.value}
          onChange={(value) => {
            field.onChange(value)
            onAnswer(value)
          }}
        />
      )
    case 'section':
      return (
        <div className="flex justify-center">
          <Button
            onClick={(e) => {
              e.preventDefault()
              onAnswer(null)
            }}
          >
            Gå vidare
          </Button>
        </div>
      )
    default:
      break
  }
}

const QuestionSelector = ({ question }: { question: Question }) => {
  const { control } = useFormContext()
  const setPage = useSetAtom(formPageAtom)
  const plainTextLength = question.text
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;\s]+;/g, ' ')
    .trim().length
  const useCompactText = plainTextLength > 250

  const onAnswer = (_: any) => {
    setTimeout(() => setPage((page) => page + 1), 400)
  }

  return (
    <section className="flex h-full w-full items-center justify-center bg-background px-4 pt-24 sm:px-8 md:px-16">
      <FormField
        control={control}
        name={question.id}
        render={({ field }) => (
          <FormItem className="w-full max-w-3xl bg-card px-5 py-10 text-center shadow-sm sm:px-12 md:px-16">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-start justify-center gap-2">
                <FormLabel className="text-3xl font-black leading-none text-foreground">
                  {question.type === 'section'
                    ? 'Information'
                    : `Fråga ${question.number}`}
                </FormLabel>
                {question.required && (
                  <span className="text-xl font-black text-destructive">*</span>
                )}
                {question.resource && (
                  <ResourceDrawer resource={question.resource} />
                )}
                {!question.resource && question.resourceCollection && (
                  <ResourceDrawer
                    resourceCollection={question.resourceCollection}
                  />
                )}
              </div>
              <div className="h-px w-full bg-foreground" />
              <FormLabel
                className={`mx-auto max-w-2xl font-black text-foreground ${
                  useCompactText
                    ? 'text-base leading-snug sm:text-lg'
                    : 'text-xl leading-snug'
                }`}
                dangerouslySetInnerHTML={{
                  __html: `${question.text}`,
                }}
              />
            </div>
            <FormControl>
              <div className="mt-8 flex justify-center">
                {renderQuestionType(question, field, onAnswer)}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    </section>
  )
}

export default QuestionSelector
