import { useAtom, useAtomValue } from 'jotai'
import { authAtom, pb, userDataAtom } from '../../state'
import { Card } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

function ProfilePage() {
  const [, setAuth] = useAtom(authAtom)
  const userData = useAtomValue(userDataAtom)

  const handleLogout = () => {
    pb.authStore.clear()
    setAuth(null)
  }

  if (!userData) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black md:text-5xl">Profil</h1>
      </div>
      <Card className="border-0 bg-white p-6 shadow-none">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-black">Telefonnummer</h2>
            <p className="mt-2 text-lg font-bold">{userData.phoneNumber}</p>
          </div>
          <div>
            <h2 className="text-xl font-black">Behandlingsstart</h2>
            <div className="mt-2">
              <DatePicker
                date={userData.treatmentStart}
                onChange={() => {}}
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black">Behandlingsslut</h2>
            <div className="mt-2">
              <DatePicker date={userData.treatmentEnd} onChange={() => {}} />
            </div>
          </div>
        </div>
      </Card>
      <Button
        type="button"
        onClick={handleLogout}
        variant="destructive"
        className="h-12 rounded-xl px-5 font-black text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logga ut
      </Button>
    </div>
  )
}

export default ProfilePage
