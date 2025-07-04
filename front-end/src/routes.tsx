import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BeforeLayout } from './layouts/BeforeLayout'
import { Login } from './pages/Login'
import { CreateAccount } from './pages/CreateAccount'
import { NotFound } from './pages/NotFound'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Profile } from './pages/Perfil'
import { Home } from './pages/Home'
import { Certificates } from './pages/Certificates'


export const router = createBrowserRouter([
    {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/inicio" replace />,
      },
      {
        path: 'inicio',
        element: <Home/>,
      },
      {
        path: 'certificados',
        element: <Certificates/>,
      },
      {
        path: 'perfil',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/',
    element: <BeforeLayout />,
    children: [
      {
        path: '/cadastrar',
        element: <CreateAccount />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <></>,
      },
    ],
  },
])