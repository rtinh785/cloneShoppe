import AsideFilter from './components/AsideFilter'
import SortProducList from './components/SortProductList/SortProducList'
import Product from './components/Product/index'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination'
import type { ProductListConfig } from '../../types/product.type'
import categoryApi from '../../apis/category.api'
import useQueryConfig from '../../hooks/useQueryConfig'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

const ProducList = () => {
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000 // 3 minutes
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='my-container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []}></AsideFilter>
            </div>
            <section className='col-span-9'>
              <SortProducList
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              ></SortProducList>
              <section className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
              </section>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size}></Pagination>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProducList
