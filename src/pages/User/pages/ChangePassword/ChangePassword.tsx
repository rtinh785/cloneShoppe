import { useForm } from 'react-hook-form'
import Input from '../../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema, type UserSchema } from '../../../../utils/rules'
import * as yup from 'yup'
type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const profileSchema = userSchema.pick(['password', 'new_password', 'confirm_password']) as yup.ObjectSchema<FormData>

const ChangePassword = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(profileSchema)
  })
  return (
    <section className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Đổi mật khẩu</h1>
        <p className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit} noValidate>
        <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Mật khẩu cũ:</div>
          <div className='ms:pl-5 sm:w-[80%]'>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              register={register}
              name='password'
              type='password'
              placeholder='Nhập mật khẩu hiện tại'
              errorsMessage={errors.password?.message}
            ></Input>
          </div>
        </div>
        <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Mật khẩu mới:</div>
          <div className='ms:pl-5 sm:w-[80%]'>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              register={register}
              name='new_password'
              type='password'
              placeholder='Nhập mật khẩu hiện mới'
              errorsMessage={errors.new_password?.message}
            ></Input>
          </div>
        </div>
        <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Nhập lại mật khẩu mới:</div>
          <div className='ms:pl-5 sm:w-[80%]'>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              register={register}
              name='confirm_password'
              type='password'
              placeholder='Nhập lại mật khẩu hiện mới'
              errorsMessage={errors.confirm_password?.message}
            ></Input>
          </div>
        </div>
      </form>
    </section>
  )
}

export default ChangePassword
