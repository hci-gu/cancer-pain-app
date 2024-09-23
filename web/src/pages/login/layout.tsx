import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useParams } from 'react-router-dom'

const LoginLayout = ({ children }: { children: any }) => {
  const params = useParams()
  const hasToken = !!params.token

  const breadCrumbs = hasToken
    ? [
        {
          label: 'Home',
          href: '/welcome',
        },
        {
          label: 'Login',
          href: '/login',
        },
        {
          label: 'OTP',
        },
      ]
    : [
        {
          label: 'Home',
          href: '/welcome',
        },
        {
          label: 'Login',
        },
      ]
  const description = hasToken
    ? 'Enter your the code sent to your phone'
    : 'Please enter your phone number to reset your password'

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {breadCrumbs.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
              {index < breadCrumbs.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export default LoginLayout
