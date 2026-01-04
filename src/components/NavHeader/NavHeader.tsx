import { Link } from 'react-router-dom'
import path from '../../constants/path'
import Popover from '../Popover'

import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import { queryClient } from '../../main'
import { purchaseStatuses } from '../../constants/purchase'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.api'

const NavHeader = () => {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const logoutMutaion = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatuses.inCart }] })
    }
  })
  return (
    <div className='flex justify-end'>
      <Popover
        className='flex cursor-pointer items-center py-1 hover:text-gray-300'
        renderPopover={
          <>
            <ul className='pr-5'>
              <li>
                <button className='px-3 py-2 hover:text-orange-200'>Tiếng Việt</button>
              </li>
              <li>
                <button className='px-3 py-2 hover:text-orange-200'>Tiếng Anh</button>
              </li>
            </ul>
          </>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated ? (
        <Popover
          className='ml-6 flex cursor-pointer items-center justify-center py-1 hover:text-gray-300'
          renderPopover={
            <>
              <ul>
                <li>
                  <Link to='/' className='block px-3 py-2 hover:text-cyan-500'>
                    Tài khoản của tôi
                  </Link>
                </li>
                <li>
                  <Link to='/' className='block px-3 py-2 hover:text-cyan-500'>
                    Đơn mua
                  </Link>
                </li>
                <li>
                  <button
                    className='block px-3 py-2 hover:text-cyan-500'
                    onClick={() => {
                      logoutMutaion.mutate()
                    }}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </>
          }
        >
          <div className='mr-2 h-6 w-6 shrink-0'>
            <img
              src='https://scontent.fvca2-1.fna.fbcdn.net/v/t1.6435-9/34448691_638284539859010_2195386663792803840_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=0bYM9Ls1-yQQ7kNvwGa_TY3&_nc_oc=AdnsdyvQhTeg8O1PJsgvndWLUiWK8hgRxwx-wJ4tKMwZ4A9TlWGVn3NPzGV-ZXAzU3ECag6LZerMBi5rqV7AvYMH&_nc_zt=23&_nc_ht=scontent.fvca2-1.fna&_nc_gid=gUd0XHCSv7ffiAbqAApmNQ&oh=00_Afnl0wS87Pw1a1DsoIkdD6F6pijrOGePuC14GLtr03oLOA&oe=6960E958'
              alt='avatar'
              className='w-fill h-full rounded-full object-cover'
            />
          </div>
          <span>{profile?.email}</span>
        </Popover>
      ) : (
        <div className='flex items-center'>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Đăng nhập
          </Link>
          <div className='h-4 border-r border-r-white/40'></div>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Đăng ký
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavHeader
