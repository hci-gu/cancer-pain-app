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
import { useEffect } from 'react'

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

  useEffect(() => {
    // get query params
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.has('code')) {
      const code = urlParams.get('code')
      form.setValue('password', code ?? '')
      onSubmit({ password: code ?? '' })
    }
  }, [])

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/otp-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: values.password,
            verifyToken: token,
          }),
        }
      )

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
              <FormLabel>Engångskod</FormLabel>
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
                Kod skickad till ditt telefonnummer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Skicka in</Button>
      </form>
    </Form>
  )
}

export default OTPPage
