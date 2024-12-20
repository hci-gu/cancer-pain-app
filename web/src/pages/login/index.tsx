import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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

const LoginPage = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/otp-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: values.phoneNumber,
      }),
    })
    const data = await response.json()

    if (response.ok) {
      navigate(`${data.id}`)
    } else {
      form.setError('phoneNumber', {
        type: 'manual',
        message: data.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input
                  placeholder="Telefonnummer att skicka kod till..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Skicka engångskod</Button>
      </form>
    </Form>
  )
}

export default LoginPage
