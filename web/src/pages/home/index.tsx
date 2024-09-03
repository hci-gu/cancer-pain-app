import { Button } from '@/components/ui/button'
import Pocketbase from 'pocketbase'

function HomePage() {
  const createOtp = async () => {
    await fetch('http://localhost:8090/otp-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '0761601552',
      }),
    })
  }

  const auth = async () => {
    const pb = new Pocketbase('http://localhost:8090')

    const response = await fetch('http://localhost:8090/otp-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: '',
        verifyToken: '',
      }),
    })

    const data = await response.json()
    pb.authStore.save(data.token, data.record)

    const users = await pb.collection('users').getFullList()
    console.log('users', users)
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <Button onClick={() => auth()}>Test auth</Button>
      <Button className="mt-4" onClick={() => createOtp()}>
        Skapa
      </Button>
    </div>
  )
}

export default HomePage
