import { Button } from '@/components/ui/button'
import Pocketbase from 'pocketbase'
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

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

const loginSchema = z.object({
  password: z.string().min(6).max(6),
})

function LoginPage() {
  const { token } = useParams()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const pb = new Pocketbase('http://localhost:8090')

    const response = await fetch('http://localhost:8090/otp-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: values.password,
        verifyToken: token,
      }),
    })

    const data = await response.json()
    pb.authStore.save(data.token, data.record)

    const users = await pb.collection('users').getFullList()
    console.log('users', users)
  }

  return (
    <div className="flex justify-center align-items">
      <div className="w-60">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Six numbers " {...field} />
                  </FormControl>
                  <FormDescription>
                    Password sent to your phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
