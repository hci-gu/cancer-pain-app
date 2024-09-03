import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

const resetSchema = z.object({
  phoneNumber: z.string().min(2).max(20),
})

const ResetPage = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    const response = await fetch('http://localhost:8090/otp-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: values.phoneNumber,
      }),
    })
    const data = await response.json()

    navigate(`/login/${data.id}`)
  }

  return (
    <div className="flex justify-center align-items">
      <div className="w-60">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="Number goes here..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Phone number to receive reset password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResetPage
