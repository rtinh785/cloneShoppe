import { createSearchParams, Link } from 'react-router-dom'
import path from '../../../../constants/path'
import { purchaseStatuses } from '../../../../constants/purchase'
import classnames from 'classnames'
import useQueryParams from '../../../../hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import purchaseApi from '../../../../apis/purchases'
import type { PurchaseListStatus } from '../../../../types/purchases.type'
import { formatCurrency, generateNameId } from '../../../../utils/utils'

const purchaseTabs = [
  { status: purchaseStatuses.all, name: 'Tất cả' },
  { status: purchaseStatuses.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchaseStatuses.waitForGetting, name: ' Chờ lấy hàng' },
  { status: purchaseStatuses.inProgress, name: ' Đang giao' },
  { status: purchaseStatuses.delivered, name: 'Đã nhận' },
  { status: purchaseStatuses.cancel, name: ' Đã huỷ' }
]

const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatuses.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchasesList({ status: status as PurchaseListStatus })
  })
  const purchasesInCart = purchasesInCartData?.data.data || []

  return (
    <>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <nav className='sticky top-0 flex rounded-t-sm shadow-sm'>
            {purchaseTabs.map((tab, index) => (
              <Link
                to={{
                  pathname: path.historyPurchase,
                  search: createSearchParams({
                    status: tab.status.toString()
                  }).toString()
                }}
                className={classnames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                  'border-b-orange-600 text-orange-600': status === tab.status,
                  'border-b-black/10 text-gray-900': status !== tab.status
                })}
                key={index}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
          <div>
            {purchasesInCart.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='shrink-0'>
                    <img src={purchase.product.image} alt='product' className='size-20 object-cover' />
                  </div>
                  <div className='ml-3 grow overflow-hidden'>
                    <h3 className='truncate'> {purchase.product.name}</h3>
                    <span className='mt-3'>x{purchase.buy_count}</span>
                  </div>
                  <div className='ml-3 shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      đ{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 truncate text-orange-600'>đ{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-xl text-orange-600'>
                      {formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoryPurchase
