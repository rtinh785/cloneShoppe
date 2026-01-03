import { useMutation, useQuery } from '@tanstack/react-query'
import { purchaseStatuses } from '../../constants/purchase'
import purchaseApi from '../../apis/purchases'

import path from '../../constants/path'
import { Link } from 'react-router-dom'
import { formatCurrency, generateNameId } from '../../utils/utils'
import QuantityController from '../../components/QuantityController/index'
import Button from '../../components/Button'
import { useEffect, useState } from 'react'
import type { Purchase } from '../../types/purchases.type'
import { produce } from 'immer'
import { queryClient } from '../../main'
import noProducts from '../../assets/img/noProducts.png'
import { toast } from 'react-toastify'

interface ExtendedPurchase extends Purchase {
  checked: boolean
  disable: boolean
}

const Cart = () => {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])

  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasesPrice = checkedPurchases.reduce((result, current) => {
    return result + current.product.price * current.buy_count
  }, 0)
  const totalCheckedPurchasesSavingPrice = checkedPurchases.reduce((result, current) => {
    return result + (current.product.price_before_discount - current.product.price) * current.buy_count
  }, 0)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatuses.inCart }],
    queryFn: () => purchaseApi.getPurchasesList({ status: purchaseStatuses.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatuses.inCart }] })
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatuses.inCart }] })
    }
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        autoClose: 1000,
        position: 'top-left'
      })
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatuses.inCart }] })
    }
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExtendedPurchases(
      purchasesInCartData?.data.data.map((purchase, index) => {
        return {
          ...purchase,
          checked: extendedPurchases[index]?.checked || false,
          disable: false
        }
      }) || []
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasesInCartData])

  const handleChecked = (productIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draftState) => {
        draftState[productIndex].checked = e.target.checked
      })
    )
  }

  const handleAllChecked = () => {
    setExtendedPurchases((pre) =>
      pre.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draftState) => {
          draftState[purchaseIndex].disable = true
        })
      )

      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draftState) => {
        draftState[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDeletePurchase = (purchaseId: string) => {
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeletePurchases = () => {
    const ArrayPurchasesChecked = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(ArrayPurchasesChecked)
    setExtendedPurchases(
      purchasesInCartData?.data.data.map((purchase) => {
        return {
          ...purchase,
          checked: false,
          disable: false
        }
      }) || []
    )
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => {
        return {
          product_id: purchase.product._id,
          buy_count: purchase.buy_count
        }
      })

      buyPurchaseMutation.mutate(body)
    }
  }

  return purchasesInCartData?.data.data.length === 0 ? (
    <div className='flex flex-col items-center justify-center py-30'>
      <img src={noProducts} alt='noProducts' className='size-60 object-cover' />
      <div className='text-md mt-3'>Chưa có sản phẩm trong giỏ hàng</div>
    </div>
  ) : (
    <div className='bg-neutral-100 py-16'>
      <div className='my-container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm text-gray-500 capitalize shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='size-5 accent-orange-600'
                      checked={isAllChecked}
                      onChange={handleAllChecked}
                    />
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
              {extendedPurchases?.map((purchase, index) => (
                <div
                  key={purchase._id}
                  className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='size-5 accent-orange-600'
                          checked={purchase.checked}
                          onChange={handleChecked(index)}
                        />
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
                              className='line-clamp-2 text-left'
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
                          OnIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                          OnDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          OnType={handleTypeQuantity(index)}
                          OnFocusOut={(value) => {
                            console.log(` Data cũ:${purchasesInCartData?.data.data[index].buy_count} và value:${value}`)
                            return handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= purchase.product.quantity &&
                                purchasesInCartData?.data.data[index].buy_count !== value
                            )
                          }}
                          disabled={purchase.disable}
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange-600'>
                          đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button
                          className='bg-none text-black transition-colors hover:text-orange-600'
                          onClick={() => handleDeletePurchase(purchase._id)}
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='size-5 accent-orange-600'
                checked={isAllChecked}
                onChange={handleAllChecked}
              />
            </div>
            <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>
            <button className='mx-3 border-none bg-none' onClick={handleDeletePurchases}>
              Xoá
            </button>
          </div>

          <div className='mt-5 flex flex-col sm:mt-0 sm:ml-auto sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <span>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</span>
                <div className='ml-2 text-2xl text-orange-600'>đ{formatCurrency(totalCheckedPurchasesPrice)}</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange-600'>đ{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
              </div>
            </div>
            <Button
              className='mt-5 flex h-10 w-52 items-center justify-center bg-orange-600 text-center text-sm text-white uppercase hover:bg-orange-700 sm:mt-0 sm:ml-4'
              onClick={handleBuyPurchases}
              disabled={buyPurchaseMutation.isPending}
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
