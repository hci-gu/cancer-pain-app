import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Question } from '@/state'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { useRef } from 'react'
import {
  ControllerRenderProps,
  FieldValues,
  useForm,
  useFormContext,
} from 'react-hook-form'

const renderQuestionType = (
  question: Question,
  field: ControllerRenderProps<FieldValues, any>
) => {
  switch (question.type) {
    case 'text':
      return <Input placeholder={question.placeholder} {...field} />
    case 'painScale':
      return (
        <Input
          placeholder={question.placeholder}
          {...field}
          type="range"
          min="0"
          max="10"
        />
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

      return (
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>
              <input type="radio" id={option} {...field} />
              <label htmlFor={option}>{option}</label>
            </li>
          ))}
        </ul>
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
              {question.required && <span className="text-red-500">*</span>}
              <FormLabel
                dangerouslySetInnerHTML={{
                  __html: `${question.text}`,
                }}
              />
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
