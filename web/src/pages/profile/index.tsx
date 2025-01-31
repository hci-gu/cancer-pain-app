import { useAtom, useAtomValue } from 'jotai'
import { authAtom, pb, userDataAtom } from '../../state'
import { Card } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'

function ProfilePage() {
  const [_, setAuth] = useAtom(authAtom)
  const userData = useAtomValue(userDataAtom)

  const handleLogout = () => {
    pb.authStore.clear()
    setAuth(null)
  }

  if (!userData) {
    return null
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Profil</h1>
      <Card className="p-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold">Telefonnummer</h2>
            <p>{userData.phoneNumber}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Behandlingsstart</h2>
            <DatePicker
              date={
                userData?.treatmentStart ?? new Date(userData.treatmentStart!)
              }
              onChange={() => {}}
            />
          </div>
        </div>
      </Card>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Logga ut
      </button>
    </div>
  )
}

export default ProfilePage
