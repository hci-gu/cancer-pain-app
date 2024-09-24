import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import HomePage from './pages/home/index.tsx'
import FormsPage from './pages/form/forms.tsx'
import LoginPage from './pages/login/index.tsx'
import RootPage from './root.tsx'
import { useAtomValue } from 'jotai'
import { authAtom } from './state.tsx'
import WelcomePage from './pages/welcome/index.tsx'
import LoginLayout from './pages/login/layout.tsx'
import OTPPage from './pages/login/code.tsx'
import FormPage from './pages/form/index.tsx'

const WithAuthLayout = ({ children }: { children: any }) => {
  const auth = useAtomValue(authAtom)

  if (!auth) {
    return <Navigate to="/welcome" />
  }
  return <div>{children}</div>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: '',
        element: (
          <WithAuthLayout>
            <HomePage />
          </WithAuthLayout>
        ),
      },
      {
        path: 'forms',
        element: (
          <WithAuthLayout>
            <FormsPage />
          </WithAuthLayout>
        ),
      },
      {
        path: 'forms/:id',
        element: (
          <WithAuthLayout>
            <FormPage />
          </WithAuthLayout>
        ),
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      {
        path: 'login',
        element: (
          <LoginLayout>
            <LoginPage />
          </LoginLayout>
        ),
      },
      {
        path: 'login/:token',
        element: (
          <LoginLayout>
            <OTPPage />
          </LoginLayout>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
