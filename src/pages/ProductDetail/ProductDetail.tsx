import { useParams } from 'react-router-dom'
import productApi from '../../apis/product.api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../../utils/utils'
import InputNumber from '../../components/InputNumber'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Product as ProductType, ProductListConfig } from '../../types/product.type'
import Product from '../ProducList/components/Product'

const ProductDetail = () => {
  const { nameId } = useParams<{ nameId: string }>()
  const id = getIdFromNameId(nameId as string)

  const { data: productDetailData } = useQuery({
    queryKey: ['product'],
    queryFn: () => {
      return productApi.getProductDetail(id as string)
    },
    placeholderData: keepPreviousData
  })

  const product = productDetailData?.data.data

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000 // 3 minutes
  })

  const imageRef = useRef<HTMLImageElement>(null)

  const [activeImage, setActiveImage] = useState('')

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const image = imageRef.current as HTMLImageElement
    const { offsetX, offsetY } = e.nativeEvent
    const { naturalWidth, naturalHeight } = image
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = `${naturalWidth}px`
    image.style.height = `${naturalHeight}px`
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleMouseLeave = () => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return null

  return (
    <section className='bg-gray-200 py-6'>
      <div className='my-container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleMouseLeave}
              >
                {activeImage && (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className='pointer-events-none absolute top-0 left-0 size-full bg-white object-cover'
                    ref={imageRef}
                  />
                )}
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='bg-opacity-20 absolute top-1/2 left-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 size-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange-600'></div>}
                    </div>
                  )
                })}
                <button
                  className='bg-opacity-20 absolute top-1/2 right-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange-600 text-orange-600'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange-600 text-orange-600 size-4'
                    nonActiveClassnamee='fill-gray-300 text-gray-300 size-4'
                  ></ProductRating>
                </div>
                <div className='mx-4 h-4 w-px bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>đ{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange-600'>{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange-600 px-1 py-0.5 text-xs font-semibold text-white uppercase'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <p className='text-gray-500 capitalize'>Số lượng</p>
                <div className='item-center ml-10 flex'>
                  <button className='flex size-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    className=''
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  ></InputNumber>
                  <button className='flex size-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='flex h-12 cursor-pointer items-center justify-center rounded-sm border border-orange-600 bg-orange-600/10 px-5 text-orange-600 capitalize shadow-sm hover:bg-orange-500/5'>
                  <img
                    className='mr-[10px ] mr-2 size-5 object-cover'
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/f600cbfffbe02cc144a1.svg'
                    alt='shop'
                  />
                  Thêm vào giỏ hàng
                </div>
                <button className='ml-4 flex h-12 min-w-20 items-center justify-center rounded-sm bg-orange-600 px-5 text-white capitalize shadow-sm outline-none hover:bg-orange-600/90'>
                  mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className='my-container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg text-slate-700 capitalize'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
        <div className='mt-8'>
          <div className='my-container'>
            <div className='text-gray-400 uppercase'> CÓ THỂ BẠN CŨNG THÍCH</div>
            <section className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData &&
                productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
            </section>
          </div>
        </div>
      </section>
    </section>
  )
}

export default ProductDetail
