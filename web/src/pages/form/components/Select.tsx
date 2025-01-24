import { FormControl, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Question } from '@/state'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

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
  return (
    <RadioGroup
      name={question.id}
      value={field.value}
      defaultValue={field.value}
      className="flex flex-wrap gap-2 sm:gap-4 leading-tight sm:leading-normal"
    >
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

        const isChecked =
          question.type === 'singleChoice'
            ? compareOptionValues(field.value, option)
            : field.value?.some((val: string) =>
                compareOptionValues(val, option)
              )

        return (
          <FormItem
            className="flex items-center"
            key={`${question.id}_${option}_${index}`}
          >
            <FormControl>
              <input
                type={question.type === 'multipleChoice' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option}
                id={`${question.id}-option-${index}`}
                className="hidden peer"
                onChange={(e) => updateValue(option, e.target.checked)}
                checked={isChecked}
              />
            </FormControl>
            <label
              htmlFor={`${question.id}-option-${index}`}
              className="flex items-center justify-center px-2 py-2 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-100 peer-checked:font-semibold transition-colors duration-200 sm:px-6 sm:py-3"
            >
              {option.split('{AMOUNT}')?.[0]}
              {option.split('{AMOUNT}')?.[1] && (
                <Input
                  ref={(el) => (optionInputRefs.current[index] = el)}
                  type="number"
                  min={0}
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
}
