import { cn } from '@/lib/utils'

function HomeTodoItem({
  children,
  index,
  className = '',
  background = 'bg-white',
}: {
  children: React.ReactNode
  index: number
  className?: string
  background?: string
}) {
  const textColor =
    background === 'bg-white'
      ? 'text-black'
      : background.replace('bg', 'text').replace('100', '800')

  return (
    <div
      className={cn(
        `flex items-center space-x-2 p-4 rounded-md ${background}`,
        className
      )}
    >
      <strong className={textColor}>{index}.</strong>
      {children}
    </div>
  )
}

export default HomeTodoItem
