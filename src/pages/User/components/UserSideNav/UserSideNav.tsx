import { useContext } from 'react'
import path from '../../../../constants/path'
import { Link } from 'react-router-dom'
import { AppContext } from '../../../../context/app.context'
import { getAvatarURL } from '../../../../utils/utils'

const UserSideNav = () => {
  const { profile } = useContext(AppContext)
  return (
    <section>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='size-12 shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={getAvatarURL(profile?.avatar)} alt='avatar' className='size-full object-cover' />
        </Link>
        <div className='grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>
            {profile?.name ? profile?.name : profile?.email}
          </div>
          <Link to={path.profile} className='flex items-center text-gray-500 capitalize'>
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <Link to={path.profile} className='flex items-center text-orange-600 capitalize transition-colors'>
          <div className='mr-3 size-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              className='size-full'
            />
          </div>
          Tài khoản của tôi
        </Link>
        <Link to={path.changePassword} className='mt-4 flex items-center text-gray-600 capitalize transition-colors'>
          <div className='mr-3 size-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              className='size-full'
            />
          </div>
          Thay đổi mật khẩu
        </Link>
        <Link to={path.historyPurchase} className='mt-4 flex items-center text-gray-600 capitalize transition-colors'>
          <div className='mr-3 size-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              className='size-full'
            />
          </div>
          Đơn mua
        </Link>
      </div>
    </section>
  )
}

export default UserSideNav
