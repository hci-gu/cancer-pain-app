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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { authAtom, pb } from '../../state'
import { useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  password: z.string().min(6).max(6),
})

function OTPPage() {
  const { token } = useParams()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  })
  const setAuth = useSetAtom(authAtom)
  const navigate = useNavigate()

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await fetch('http://192.168.10.107:8090/otp-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: values.password,
          verifyToken: token,
        }),
      })

      if (!response.ok) {
        throw new Error('OTP verification failed')
      }

      const data = await response.json()
      pb.authStore.save(data.token, data.record)

      document.cookie = pb.authStore.exportToCookie()

      setAuth(pb.authStore.model)

      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={() => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  onChange={(value) => {
                    form.setValue('password', value)
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
  )
}

export default OTPPage
