import { Button } from '@/components/ui/button'

const AbortButton = () => {
  const onClick = () => {
    // close the tab
    console.log('clicked')
    location.replace('https://www.google.com')
  }

  return (
    <div className="fixed bottom-32 right-4 w-80 z-50">
      <div className="">
        <div className="bg-yellow-500 bg-opacity-50 p-4 rounded-md shadow-md border border-yellow-600">
          <div className="text-center">
            <p className="text-lg">Hoppa ur formuläret snabbt</p>
            <p className="text-sm text-gray-600">
              Genom att klicka på knappen stängs fönstret ner direkt och du
              loggas ut
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="button" onClick={onClick} variant="destructive">
              Lämna genast
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AbortButton
