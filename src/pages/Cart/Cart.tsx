import { useQuery } from '@tanstack/react-query'
import { purchaseStatuses } from '../../constants/purchase'
import purchaseApi from '../../apis/purchases'

import path from '../../constants/path'
import { Link } from 'react-router-dom'
import { formatCurrency, generateNameId } from '../../utils/utils'
import QuantityController from '../../components/QuantityController/index'

const Cart = () => {
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatuses.inCart }],
    queryFn: () => purchaseApi.getPurchasesList({ status: purchaseStatuses.inCart })
  })
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='my-container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm text-gray-500 capitalize shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex shrink-0 items-center justify-center pr-3'>
                    <input type='checkbox' className='size-5 accent-orange-600' />
                  </div>
                  <div className='grow text-black'> Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {purchasesInCartData?.data.data.map((purchase) => (
                <div
                  key={purchase._id}
                  className='mt-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex shrink-0 items-center justify-center pr-3'>
                        <input type='checkbox' className='size-5 accent-orange-600' />
                      </div>
                      <div className='grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            className='size-20 shrink-0'
                          >
                            <img src={purchase.product.image} alt={purchase.product.name} />
                          </Link>
                          <div className='grow px-2 pt-1 pb-2'>
                            <Link
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className='line-clamp-2'
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 items-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            đ{formatCurrency(purchase.product.price_before_discount)}
                          </span>
                          <span className='ml-3'> đ{formatCurrency(purchase.product.price)} </span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          classNameWrapper='ml-0 flex items-center'
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange-600'>
                          đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button className='bg-none text-black transition-colors hover:text-orange-600'>Xoá</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
