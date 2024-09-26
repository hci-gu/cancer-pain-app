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
import { useRef } from 'react'
import {
  ControllerRenderProps,
  FieldValues,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { RadioGroupForm } from './Test'

const renderQuestionType = (
  question: Question,
  field: ControllerRenderProps<FieldValues, any>
) => {
  switch (question.type) {
    case 'text':
      return <Input placeholder={question.placeholder} {...field} />
    case 'painScale':
      return (
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex"
        >
          {Array.from({ length: 11 }).map((_, index) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value={index} />
              </FormControl>
              <FormLabel className="font-normal">{index}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )
    case 'singleChoice':
      return (
        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
          {question.options.map((option, _) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value={option} />
              </FormControl>
              <FormLabel className="font-normal">{option}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )
    default:
      break
  }
}

const QuestionSelector = ({
  question,
  questionNumber,
  refCallback,
}: {
  question: Question
  questionNumber: number
  refCallback: (el: HTMLElement | null) => void
}) => {
  const { control } = useFormContext()
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <section className="h-screen flex items-center justify-center snap-start">
      <div
        ref={(el) => {
          ref.current = el
          refCallback(el)
        }}
      >
        <FormField
          control={control}
          name={question.id}
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormLabel className="text-xl">{questionNumber}.</FormLabel>
                {question.required && <span className="text-red-500">*</span>}
                <FormLabel
                  className="text-xl"
                  dangerouslySetInnerHTML={{
                    __html: `${question.text}`,
                  }}
                />
              </div>
              <FormControl>{renderQuestionType(question, field)}</FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </div>
    </section>
  )
}

export default QuestionSelector
