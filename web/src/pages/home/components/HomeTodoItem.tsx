import { cn } from '@/lib/utils'

function HomeTodoItem({
  icon,
  index,
  title,
  description = '',
  done = false,
  action,
}: {
  icon: React.ReactNode
  index: number
  title: string
  description?: string
  done?: boolean
  action?: React.ReactNode
}) {
  const background = done ? 'bg-green-100' : 'bg-white'
  const textClass = done ? 'text-green-800 font-medium' : 'text-black'

  return (
    <div
      className={cn(
        `flex items-center space-x-2 p-4 rounded-md border border-transparent hover:border hover:border-gray-300 ${background}`
      )}
    >
      <strong className={textClass}>{index}.</strong>
      {icon}
      <div>
        <h3 className={textClass}>{title}</h3>
        <p className={`${textClass} font-light text-sm`}>{description}</p>
      </div>
      {action}
    </div>
  )
}

export default HomeTodoItem
