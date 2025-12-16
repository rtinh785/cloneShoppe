import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { toast } from 'react-toastify'

import authApi from '../../apis/auth.api'
import { schemaRegister, type FormData } from '../../utils/rules'
import Input from '../../components/Input/index'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import type { ErroResponse } from '../../types/utils.type'
import Button from '../../components/Button'
import path from '../../constants/path'

const Register = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaRegister)
  })

  const registerAccountMutation = useMutation({
    mutationFn: authApi.registerAccount
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        toast('Bạn đã đăng ký thành công')
        reset()
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErroResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-primary'>
      <div className='my-container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input<FormData>
                type='email'
                errorsMessage={errors.email?.message}
                placeholder='Email'
                className='mt-8'
                name='email'
                register={register}
              />
              <Input<FormData>
                type='password'
                errorsMessage={errors.password?.message}
                placeholder='Password'
                className='mt-2'
                name='password'
                register={register}
              />

              <Input<FormData>
                type='password'
                errorsMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                className='mt-2'
                name='confirm_password'
                register={register}
              />

              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm text-white uppercase hover:bg-red-600'
                  isLoading={registerAccountMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
