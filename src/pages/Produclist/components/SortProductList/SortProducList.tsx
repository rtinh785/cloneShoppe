import { sortBy, order as orderConstants } from '../../../../constants/products'
import type { ProductListConfig } from '../../../../types/product.type'

import classnames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../../constants/path'
import { omit } from 'lodash'
import type { QueryConfig } from '../../ProducList'

interface PaginationProps {
  queryConfig: QueryConfig
  pageSize: number
}

const SortProducList = ({ queryConfig, pageSize }: PaginationProps) => {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const nagivate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => sort_by === sortByValue

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    nagivate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handleOrder = (orderConstants: Exclude<ProductListConfig['order'], undefined>) => {
    nagivate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderConstants
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <nav className='item-center flex flex-wrap gap-2'>
          <span className='my-auto'>Sắp xếp theo</span>
          <button
            className={classnames('h-8 px-4 text-center text-sm', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classnames('h-8 px-4 text-center text-sm', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classnames('h-8 px-4 text-center text-sm', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classnames('h-8 px-4 text-left text-sm capitalize outline-none', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handleOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black hover:bg-slate-100'>
              Giá
            </option>
            <option value={orderConstants.asc} className='bg-white text-black hover:bg-slate-100'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstants.desc} className='bg-white text-black hover:bg-slate-100'>
              Giá: Cao đến thấp
            </option>
          </select>
        </nav>
        <div className='flex items-center'>
          <div>
            <span className='text-orange-600'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
                }}
                className='flex h-8 w-9 items-center justify-center rounded-tl-sm rounded-bl-sm bg-white px-3 shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
                }}
                className='flex h-8 w-9 items-center justify-center rounded-tl-sm rounded-bl-sm bg-white px-3 shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortProducList
