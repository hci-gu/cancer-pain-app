import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Question } from '@/state'
import { forwardRef, useEffect, useState } from 'react'
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form'

const compareOptionValues = (str1: string, str2: string) => {
  if (!str1 || !str2) return false

  const normalize = (str: string) =>
    str.replace(/\{\w+\}/g, '{PLACEHOLDER}')

  return normalize(str1) === normalize(str2)
}

const chipClassName =
  'flex min-h-14 min-w-20 max-w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-3 text-center text-base font-bold leading-tight text-foreground transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-checked:bg-study-teal-dark peer-checked:text-white sm:min-w-24 sm:px-7'

const SelectFollowup = ({
  question,
  index,
  disabled,
}: {
  question: Question
  index: number
  field: ControllerRenderProps<FieldValues, any>
  disabled: boolean
  onAnswer: (value: any) => void
  optionInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
}) => {
  const { control } = useFormContext()
  const id = `${question.id}_${index}`
  const options = question.options?.followup ?? []

  return (
    <FormField
      control={control}
      name={id}
      render={({ field }) => (
        <RadioGroup
          disabled={disabled}
          name={id}
          value={field.value}
          defaultValue={field.value}
          className={`flex flex-wrap justify-end gap-2 leading-tight sm:gap-3 sm:leading-normal ${
            disabled && `opacity-25`
          }`}
        >
          {options.map((option, index) => {
            return (
              <FormItem
                className="flex items-center"
                key={`${id}_${option}_${index}`}
              >
                <FormControl>
                  <input
                    type={'checkbox'}
                    name={id}
                    value={option}
                    id={`${id}_${option}_${index}`}
                    className="peer sr-only"
                    onChange={() => {
                      if (disabled) return
                      field.onChange(option)
                    }}
                    checked={option == field.value}
                  />
                </FormControl>
                <label
                  htmlFor={`${id}_${option}_${index}`}
                  className={chipClassName}
                >
                  {option}
                </label>
              </FormItem>
            )
          })}
        </RadioGroup>
      )}
    />
  )
}

interface SelectNumericalInputProps {
  initialValue: string
  disabled: boolean
  updateValue: (value: string) => void
}

const SelectNumericalInput = forwardRef<
  HTMLInputElement,
  SelectNumericalInputProps
>(({ initialValue, disabled, updateValue }, ref) => {
  const [value, setValue] = useState(initialValue ?? '')

  useEffect(() => {
    if (value.length > 0 && !isNaN(Number(value))) {
      updateValue(value)
    }
  }, [value])

  useEffect(() => {
    if (disabled) {
      setValue('')
    }
  }, [disabled])

  return (
    <Input
      ref={ref}
      type="number"
      pattern="[0-9]*"
      min={0}
      placeholder="0"
      className="mx-2 h-8 w-16 border-foreground bg-white text-center text-foreground"
      disabled={disabled}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
    />
  )
})

SelectNumericalInput.displayName = 'SelectNumericalInput'

export default function Select({
  question,
  field,
  onAnswer,
  optionInputRefs,
}: {
  question: Question
  field: ControllerRenderProps<FieldValues, any>
  onAnswer: (value: any) => void
  optionInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
}) {
  const { control } = useFormContext()
  const options = question.options?.value ?? []

  return (
    <RadioGroup
      name={question.id}
      value={field.value}
      defaultValue={field.value}
      className={`flex max-w-full flex-wrap justify-center gap-3 leading-tight sm:gap-4 sm:leading-normal ${
        question.options?.followup?.length && 'flex-col items-start'
      }`}
    >
      {options.map((option, index) => {
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
            if (question.options?.followup && !checked) {
              control.unregister(`${question.id}_${index}`)
            }
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

        const isChecked =
          question.type === 'singleChoice'
            ? compareOptionValues(field.value, option)
            : field.value?.some((val: string) =>
                compareOptionValues(val, option)
              )

        let optionNumericValue = ''
        if (option.includes('{AMOUNT}') && field.value) {
          const optionValue = field.value.find
            ? field.value?.find((val: string) =>
                compareOptionValues(val, option)
              )
            : field.value
          if (optionValue) {
            const num = optionValue.match(/\d+/)?.[0]
            optionNumericValue = num
          }
        }

        return (
          <div
            key={`${question.id}_${option}_${index}`}
            className={`flex max-w-full items-center gap-4 ${
              question.options?.followup && `justify-between w-full`
            }`}
          >
            <FormItem
              className="flex items-center"
              key={`${question.id}_${option}_${index}`}
            >
              <FormControl>
                <input
                  type={
                    question.type === 'multipleChoice' ? 'checkbox' : 'radio'
                  }
                  name={question.id}
                  value={option}
                  id={`${question.id}-option-${index}`}
                  className="peer sr-only"
                  onChange={(e) => updateValue(option, e.target.checked)}
                  checked={isChecked}
                />
              </FormControl>
              <label
                htmlFor={`${question.id}-option-${index}`}
                className={chipClassName}
              >
                {option.includes('{AMOUNT}') ? (
                  <>
                    {option.split('{AMOUNT}')?.[0]}
                    {option.split('{AMOUNT}')?.[1] && (
                      <SelectNumericalInput
                        initialValue={optionNumericValue}
                        ref={(el) => {
                          optionInputRefs.current[index] = el
                        }}
                        updateValue={(value) => {
                          const optionWithValue = option.replace(
                            '{AMOUNT}',
                            `{${value}}`
                          )
                          updateValue(optionWithValue, true)
                        }}
                        disabled={
                          question.type === 'singleChoice'
                            ? !compareOptionValues(field.value, option)
                            : !field.value ||
                              !field.value.some((val: any) =>
                                compareOptionValues(val, option)
                              )
                        }
                      />
                    )}
                    {option.split('{AMOUNT}')?.[1]}
                  </>
                ) : (
                  <p className="max-w-full break-words">
                    {option.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < option.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
              </label>
            </FormItem>
            {question.options?.followup && (
              <SelectFollowup
                question={question}
                index={index}
                disabled={!isChecked}
                field={field}
                onAnswer={onAnswer}
                optionInputRefs={optionInputRefs}
              />
            )}
          </div>
        )
      })}
    </RadioGroup>
  )
}
