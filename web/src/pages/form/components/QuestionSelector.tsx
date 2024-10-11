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
import useIsKeyboardOpen from '@/hooks/use-is-keyboard-open'
import { useSetAtom } from 'jotai'
import { formPageAtom } from '../state'
import { DatePicker } from '@/components/ui/date-picker'

const renderQuestionType = (
  question: Question,
  field: ControllerRenderProps<FieldValues, any>,
  onAnswer: (value: any) => void
) => {
  switch (question.type) {
    case 'text':
      return (
        <Input
          placeholder={question.placeholder}
          onSubmit={(e) => onAnswer(e)}
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
            <FormItem className="flex items-center space-x-3 space-y-0">
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
      return (
        <RadioGroup
          onValueChange={(value) => {
            field.onChange(value)
            onAnswer(value)
          }}
          defaultValue={field.value}
        >
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
    case 'date':
      return <DatePicker date={field.value} onChange={field.onChange} />
    default:
      break
  }
}

const QuestionSelector = ({
  question,
  questionNumber,
}: {
  question: Question
  questionNumber: number
}) => {
  const { control } = useFormContext()
  const setPage = useSetAtom(formPageAtom)
  const keyboardOpen = useIsKeyboardOpen()

  const onAnswer = (_: any) => {
    setTimeout(() => setPage((page) => page + 1), 400)
  }

  return (
    <section
      className="h-full w-full flex items-center justify-center"
      // style={{
      //   paddingBottom: keyboardOpen ? 'calc(var(--vh, 1vh) * 50)' : '0',
      //   transition: 'padding 100ms, height 100ms',
      //   border: '1px solid red',
      // }}
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
            <FormControl>
              {renderQuestionType(question, field, onAnswer)}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    </section>
  )
}

export default QuestionSelector
