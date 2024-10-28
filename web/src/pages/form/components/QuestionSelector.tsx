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
// import useIsKeyboardOpen from '@/hooks/use-is-keyboard-open'
import { useSetAtom } from 'jotai'
import { formPageAtom } from '../state'
import { DatePicker } from '@/components/ui/date-picker'
import { createRef, useRef } from 'react'

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
        <RadioGroup defaultValue={field.value} className="flex flex-wrap gap-4">
          {question.options.map((option, index) => {
            const compareOptionValues = (str1: string, str2: string) => {
              if (!str1 || !str2) return false

              const normalize = (str: string) =>
                str.replace(/\{\w+\}/g, '{PLACEHOLDER}')

              return normalize(str1) === normalize(str2)
            }

            const updateValue = (value: string, checked: boolean) => {
              if (!checked) {
                // reset optionInpurRef value
                if (optionInputRefs.current[index]) {
                  optionInputRefs.current[index].value = ''
                }
              }

              if (question.type === 'multipleChoice') {
                field.value = field.value || []

                const newValue = checked
                  ? [
                      ...field.value.filter(
                        (val: any) => !compareOptionValues(val, value)
                      ),
                      value,
                    ]
                  : field.value.filter(
                      (val: any) => !compareOptionValues(val, value)
                    )
                field.onChange(newValue)
                return
              }

              field.onChange(value)
              const optionContainsInput = option.includes('{AMOUNT}')

              if (!optionContainsInput) {
                onAnswer(value)
              } else {
                optionInputRefs.current[index]?.focus()
              }
            }

            return (
              <FormItem className="flex items-center">
                <FormControl>
                  <input
                    type={
                      question.type === 'multipleChoice' ? 'checkbox' : 'radio'
                    }
                    name={question.id}
                    value={option}
                    id={`${question.id}-option-${index}`}
                    className="hidden peer"
                    onChange={(e) => updateValue(option, e.target.checked)}
                  />
                </FormControl>
                <label
                  htmlFor={`${question.id}-option-${index}`}
                  className="flex items-center justify-center px-6 py-3  space-x-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-100 peer-checked:font-semibold transition-colors duration-200"
                >
                  {option.split('{AMOUNT}')?.[0]}
                  {option.split('{AMOUNT}')?.[1] && (
                    <Input
                      ref={(el) => (optionInputRefs.current[index] = el)}
                      type="number"
                      placeholder="0"
                      className="w-16 h-6 mx-2"
                      disabled={
                        question.type === 'singleChoice'
                          ? !compareOptionValues(field.value, option)
                          : !field.value ||
                            !field.value.some((val: any) =>
                              compareOptionValues(val, option)
                            )
                      }
                      onChange={(e) => {
                        const optionWithValue = option.replace(
                          '{AMOUNT}',
                          `{${e.target.value}}`
                        )
                        updateValue(optionWithValue, true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          target.blur()
                          onAnswer(target.value)
                        }
                      }}
                    />
                  )}
                  {option.split('{AMOUNT}')?.[1]}
                </label>
              </FormItem>
            )
          })}
        </RadioGroup>
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

  return (
    <section
      className="h-full w-full flex items-center justify-center md:px-16 px-8"
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
