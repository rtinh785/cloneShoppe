import { Link } from 'react-router-dom'
import type { Product as ProductType } from '../../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from '../../../../utils/utils'
import ProductRating from '../../../../components/ProductRating/index'
import path from '../../../../constants/path'

interface ProductProps {
  product: ProductType
}

const Product = ({ product }: ProductProps) => {
  return (
    <article>
      <Link to={`${path.home}${product._id}`}>
        <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:-translate-y-[0.04rem] hover:shadow-md'>
          <div className='relative w-full pt-[100%]'>
            <img
              src={product.image}
              alt={product.name}
              className='absolute top-0 left-0 size-full bg-white object-cover'
            />
          </div>
          <div className='overflow-hidden p-2'>
            <p className='line-clamp-2 min-h-8 text-xs'>{product.name}</p>
            <div className='mt-3 flex items-center'>
              <p className='max-w-[50%] truncate text-gray-500 line-through'>
                <span className='text-xs'>đ</span>
                <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
              </p>
              <p className='ml-1 truncate text-orange-600'>
                <span className='text-xs'>đ</span>
                <span className='text-sm'>{formatCurrency(product.price)}</span>
              </p>
            </div>
            <div className='mt-3 flex items-center justify-end'>
              <ProductRating rating={product.rating}></ProductRating>
              <div className='ml-2 text-sm'>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1'>Đã bán </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default Product
