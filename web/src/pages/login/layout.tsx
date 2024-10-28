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
          label: 'Hem',
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
          label: 'Hem',
          href: '/welcome',
        },
        {
          label: 'Login',
        },
      ]
  const description = hasToken
    ? 'Skriv in koden som skickades till din telefon'
    : 'Skriv in ditt telefonnummer för att få en kod att logga in med'

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
