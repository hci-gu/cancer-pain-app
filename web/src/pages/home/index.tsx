import { useAtom } from 'jotai'
import { authAtom, pb } from '../../state'

function HomePage() {
  const [, setAuth] = useAtom(authAtom)

  const handleLogout = () => {
    pb.authStore.clear()
    setAuth(null)
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="mb-4">You are now signed in and can access this page.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default HomePage
