import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProducList from './pages/ProducList'
import Login from './pages/Login'
import Register from './pages/Register'
import SubLayout from './layouts/SubLayout'
import MainLayout from './layouts/MainLayout'

import { useContext } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'

import UserLayout from './pages/User/layouts/UserLayout/index'
import ChangePassword from './pages/User/pages/ChangePassword/ChangePassword'

import Profile from './pages/User/pages/Profile'
import HistoryPurchase from './pages/User/pages/HistoryPurchase/HistoryPurchase'

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
          <ProducList />
        </MainLayout>
      )
    },

    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        },

        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
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
