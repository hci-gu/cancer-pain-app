import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Question } from '@/state'
import { forwardRef, useEffect, useRef, useState } from 'react'
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
  dense = false,
}: {
  question: Question
  index: number
  disabled: boolean
  dense?: boolean
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
          className={cn(
            'flex flex-wrap justify-end leading-tight sm:leading-normal',
            dense ? 'gap-1.5 sm:gap-2' : 'gap-2 sm:gap-3',
            disabled && 'opacity-25'
          )}
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
                  className={cn(
                    chipClassName,
                    dense &&
                      'min-h-10 min-w-14 rounded-lg px-4 py-2 text-sm leading-snug sm:min-h-11 sm:min-w-16 sm:px-5 sm:py-2.5 sm:text-base'
                  )}
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
  const updateValueRef = useRef(updateValue)

  useEffect(() => {
    updateValueRef.current = updateValue
  }, [updateValue])

  useEffect(() => {
    if (value.length > 0 && !isNaN(Number(value))) {
      updateValueRef.current(value)
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
  dense = false,
}: {
  question: Question
  field: ControllerRenderProps<FieldValues, string>
  onAnswer: (value: unknown) => void
  optionInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  dense?: boolean
}) {
  const { control } = useFormContext()
  const options = question.options?.value ?? []
  const hasFollowupOptions = Boolean(question.options?.followup?.length)
  const stackOptions = options.length > 2
  const stackRows = stackOptions || hasFollowupOptions

  return (
    <RadioGroup
      name={question.id}
      value={field.value}
      defaultValue={field.value}
      className={cn(
        'flex max-w-full leading-tight sm:leading-normal',
        dense && stackRows ? 'gap-2.5 sm:gap-3' : 'gap-3 sm:gap-4',
        stackRows
          ? 'w-full flex-col items-stretch'
          : 'flex-wrap justify-center',
        hasFollowupOptions && 'items-start'
      )}
    >
      {options.map((option, index) => {
        const updateValue = (value: string, checked: boolean) => {
          const selectedValues = Array.isArray(field.value)
            ? field.value.filter(
                (selectedValue): selectedValue is string =>
                  typeof selectedValue === 'string'
              )
            : []

          if (!checked) {
            // reset optionInputRef value
            if (optionInputRefs.current[index]) {
              optionInputRefs.current[index].value = ''
            }
          }

          if (question.type === 'multipleChoice') {
            const newValue = checked
              ? [
                  ...selectedValues.filter(
                    (val) => !compareOptionValues(val, value)
                  ),
                  value,
                ]
              : selectedValues.filter(
                  (val) => !compareOptionValues(val, value)
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
            : Array.isArray(field.value) &&
              field.value.some(
                (val) =>
                  typeof val === 'string' && compareOptionValues(val, option)
              )

        let optionNumericValue = ''
        if (option.includes('{AMOUNT}') && field.value) {
          const optionValue = Array.isArray(field.value)
            ? field.value.find(
                (val) =>
                  typeof val === 'string' && compareOptionValues(val, option)
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
            className={cn(
              'flex max-w-full items-center',
              dense ? 'gap-3 sm:gap-4' : 'gap-4',
              stackRows && 'w-full',
              hasFollowupOptions ? 'justify-between' : 'justify-center'
            )}
          >
            <FormItem
              className={cn(
                'flex items-center',
                stackOptions && !hasFollowupOptions && 'w-full'
              )}
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
                className={cn(
                  chipClassName,
                  stackOptions && !hasFollowupOptions && 'w-full',
                  dense &&
                    stackOptions &&
                    'min-h-10 rounded-lg px-4 py-2 text-sm leading-snug sm:min-h-11 sm:px-5 sm:py-2.5 sm:text-base'
                )}
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
                            : !Array.isArray(field.value) ||
                              !field.value.some(
                                (val) =>
                                  typeof val === 'string' &&
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
            {hasFollowupOptions && (
              <SelectFollowup
                question={question}
                index={index}
                disabled={!isChecked}
                dense={dense}
              />
            )}
          </div>
        )
      })}
    </RadioGroup>
  )
}
