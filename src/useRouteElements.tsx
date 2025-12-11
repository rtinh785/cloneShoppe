import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Produclist from './pages/Produclist'
import Login from './pages/Login'
import Register from './pages/Register'
import SubLayout from './layouts/SubLayout'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'

// eslint-disable-next-line react-refresh/only-export-components
const ProtecedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

// eslint-disable-next-line react-refresh/only-export-components
const PrejectecedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
  const routeElements = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Produclist />
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <PrejectecedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <SubLayout title='Đăng nhập'>
              <Login />
            </SubLayout>
          )
        },
        {
          path: path.register,
          element: (
            <SubLayout title='Đăng ký'>
              <Register />
            </SubLayout>
          )
        }
      ]
    }
  ])
  return routeElements
}

export default useRouteElements
