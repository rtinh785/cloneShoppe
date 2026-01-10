import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../../constants/path'
import Button from '../../../../components/Button'
import type { Categories } from '../../../../types/category.type'
import classnames from 'classnames'
import InputNumber from '../../../../components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaPrice, type FormDataPrice } from '../../../../utils/rules'
import RatingStarts from '../RatingStarts'
import { omit } from 'lodash'
import type { QueryConfig } from '../../ProducList'

interface AsideFilterProps {
  queryConfig: QueryConfig
  categories: Categories
}

const AsideFilter = ({ queryConfig, categories }: AsideFilterProps) => {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormDataPrice>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(schemaPrice),
    shouldFocusError: false
  })

  const nagivate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    const { price_min, price_max } = data as { price_min: string; price_max: string }
    nagivate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: price_min,
        price_max: price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    nagivate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['price_min', 'price_max', 'rating_filter', 'category']
        )
      ).toString()
    })
  }

  return (
    <aside className='py-4'>
      <Link
        to={path.home}
        className={classnames('flex items-center font-bold uppercase', {
          'text-orange-600': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373-208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />

                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        <h2> Tất cả danh mục</h2>
      </Link>
      <div className='my-4 h-px bg-gray-300'></div>
      <ul>
        {categories.map((cate) => {
          const isActive = cate._id === category
          return (
            <li className='py-2 pl-2' key={cate._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: cate._id
                  }).toString()
                }}
                className={classnames('relative flex px-2', {
                  'font-semibold text-orange-500': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 -left-2.5 h-2 fill-orange-600'>
                    <polygon points='4 3.5 0 0 0 7' />I
                  </svg>
                )}

                <h3>{cate.name}</h3>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        <h2> Bộ lọc tìm kiếm</h2>
      </Link>
      <div className='my-4 h-px bg-gray-300'></div>
      <div className='my-5'>
        <h3>Khoản giá</h3>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm bg-white'
                    placeholder='₫ TỪ'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm bg-white'
                    placeholder='₫ ĐẾN'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          {errors.price_min && <p className='mt-1 min-h-5 text-sm text-red-600'>{errors.price_min.message}</p>}
          <Button className='hover:bg-orange-80 mt-2 flex w-full items-center justify-center bg-orange-600 p-2 text-sm text-white uppercase'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-px bg-gray-300'></div>
      <h3 className='text-sm'>Đánh giá</h3>
      <RatingStarts queryConfig={queryConfig} />
      <div className='my-4 h-px bg-gray-300'></div>
      <Button
        className='hover:bg-orange-80 flex w-full items-center justify-center bg-orange-600 p-2 text-sm text-white uppercase'
        onClick={() => handleRemoveAll()}
      >
        Xoá tất cả
      </Button>
    </aside>
  )
}

export default AsideFilter
