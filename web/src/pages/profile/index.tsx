import { useAtom } from 'jotai'
import { authAtom, pb } from '../../state'

function ProfilePage() {
  const [, setAuth] = useAtom(authAtom)

  const handleLogout = () => {
    pb.authStore.clear()
    setAuth(null)
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Profil</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logga ut
      </button>
    </div>
  )
}

export default ProfilePage
