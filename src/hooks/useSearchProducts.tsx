import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { schemaNameSearch, type FormDataNameSearch } from '../utils/rules'
import useQueryConfig from './useQueryConfig'
import path from '../constants/path'
import { omit } from 'lodash'

const useSearchProducts = () => {
  const nagivate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormDataNameSearch>({
    defaultValues: { name: '' },
    resolver: yupResolver(schemaNameSearch)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const cofig = queryConfig.order
      ? omit({ ...queryConfig, name: data.name }, ['order', 'sort_by'])
      : { ...queryConfig, name: data.name }
    nagivate({
      pathname: path.home,
      search: createSearchParams(cofig).toString()
    })
  })
  return { onSubmitSearch, register }
}

export default useSearchProducts
