import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import SubLayout from './layouts/SubLayout'
import MainLayout from './layouts/MainLayout'

import { lazy, Suspense, useContext } from 'react'
import { AppContext } from './context/app.context'
import path from './constants/path'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout/index'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase/HistoryPurchase'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))

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
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },

    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <Suspense>
            <ScrollToTop />
            <ProductDetail />
          </Suspense>
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
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        },

        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
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
              <Suspense>
                <Login />
              </Suspense>
            </SubLayout>
          )
        },
        {
          path: path.register,
          element: (
            <SubLayout title='Đăng ký'>
              <Suspense>
                <Register />
              </Suspense>
            </SubLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <>
          <Header />
          <Suspense>
            <PageNotFound />
          </Suspense>
        </>
      )
    }
  ])
  return routeElements
}

export default useRouteElements
