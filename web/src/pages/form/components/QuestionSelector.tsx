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
import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const renderQuestionType = (
  question: Question,
  field: ControllerRenderProps<FieldValues, any>,
  onAnswer: (value: any) => void
) => {
  const optionInputRefs = useRef<(HTMLInputElement | null)[]>(
    question.options?.map(() => null)
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
          <Button onClick={() => onAnswer(null)}>Gå vidare</Button>
        </div>
      )
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
  // const keyboardOpen = useIsKeyboardOpen()

  const onAnswer = (_: any) => {
    setTimeout(() => setPage((page) => page + 1), 400)
  }

  console.log('question', question)

  return (
    <section className="h-full w-full flex items-center justify-center px-4 md:px-16 sm:px-8">
      <FormField
        control={control}
        name={question.id}
        render={({ field }) => (
          <FormItem>
            <div className="flex gap-2">
              {question.type !== 'section' && (
                <FormLabel className="text-md sm:text-xl leading-tight sm:leading-normal">
                  {questionNumber}.
                </FormLabel>
              )}
              {question.required && <span className="text-red-500">*</span>}
              <FormLabel
                className="text-md sm:text-xl leading-tight sm:leading-normal"
                dangerouslySetInnerHTML={{
                  __html: `${question.text}`,
                }}
              />
              {question.resource && (
                <Drawer>
                  <DrawerTrigger>
                    <Button size="icon">
                      <InfoCircledIcon />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="sm:m-16 h-4/5">
                    <DrawerHeader>
                      <div className="flex items-center justify-between">
                        <DrawerClose>
                          <Button variant="outline" size="icon">
                            <Cross1Icon />
                          </Button>
                        </DrawerClose>
                        <DrawerTitle>{question.resource.title}</DrawerTitle>
                        <div></div>
                      </div>
                    </DrawerHeader>
                    <div
                      className="p-8 overflow-y-scroll"
                      dangerouslySetInnerHTML={{
                        __html: `${question.resource.description}`,
                      }}
                    ></div>
                  </DrawerContent>
                </Drawer>
              )}
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
