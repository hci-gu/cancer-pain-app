import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Pocketbase from 'pocketbase'

function HomePage() {
  const [count, setCount] = useState(0)

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
      <h1>Count: {count}</h1>
      <Button onClick={() => auth()}>Increment</Button>
    </div>
  )
}

export default HomePage
