import { useState } from 'react'
import { Button } from '@/components/ui/button'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1>Count: {count}</h1>
      <Button onClick={() => setCount((count) => count + 1)}>Increment</Button>
    </div>
  )
}

export default HomePage
