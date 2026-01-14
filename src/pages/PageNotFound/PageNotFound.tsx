import { Link } from 'react-router-dom'
import path from '../../constants/path'

export default function PageNotFound() {
  return (
    <>
      <main className='bg-white-900 grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold text-orange-600'>404</p>
          <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-orange-600 sm:text-7xl'>
            Page not found
          </h1>
          <p className='mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8'>
            Xin lỗi! Chúng tôi không tìm thấy trang bạn đang tìm.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link
              to={path.home}
              className='rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
            >
              Trở lại trang chủ
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
