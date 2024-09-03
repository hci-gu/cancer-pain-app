import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import HomePage from './pages/home/index.tsx'
import FormPage from './pages/form/index.tsx'
import ResetPage from './pages/reset/index.tsx'
import LoginPage from './pages/login/index.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'form',
    element: <FormPage />,
  },
  {
    path: 'reset',
    element: <ResetPage />,
  },
  {
    path: 'login/:token',
    element: <LoginPage />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
