import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input/Input'
import { schemaLogin, type FormDataLogin } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginAccount } from '../../apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import type { SuccessResponse } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import Button from '../../components/Button'
import path from '../../constants/path'

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading }
  } = useForm<FormDataLogin>({
    resolver: yupResolver(schemaLogin)
  })

  const loginAccountMutation = useMutation({
    mutationFn: loginAccount
  })

  const onSubmit = handleSubmit((data) => {
    console.log('isLoading', isLoading)
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setProfile(data.data.data.user)
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<SuccessResponse<FormDataLogin>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-primary'>
      <div className=' my-container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl mb-6'>Đăng nhập</div>

              <Input<FormDataLogin>
                type='email'
                name='email'
                register={register}
                errorsMessage={errors.email?.message}
                placeHolder='Tài khoản'
              />

              <Input<FormDataLogin>
                type='password'
                errorsMessage={errors.password?.message}
                placeHolder='Password'
                className='mt-2'
                name='password'
                register={register}
              />
              <div className='mt-3'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                  isLoading={loginAccountMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-300'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400 ml-1' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
