import { useForm } from 'react-hook-form'
import Input from '../../../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema, type UserSchema } from '../../../../utils/rules'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import userApi, { type BodyUpdateProfile } from '../../../../apis/user.api'
import { toast } from 'react-toastify'
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import type { ErroResponse } from '../../../../types/utils.type'
import Button from '../../../../components/Button'

import { Trans } from '@lingui/react/macro'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password']) as yup.ObjectSchema<FormData>

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateUserMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        autoClose: 1000,
        position: 'top-left'
      })
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUserMutation.mutateAsync(omit(data, ['confirm_password']) as BodyUpdateProfile)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErroResponse<FormData>>(error)) {
        const formError = error.response?.data.data

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <section className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>
          <Trans>Thay đổi mật khẩu</Trans>
        </h1>
        <p className='mt-1 text-sm text-gray-700'>
          <Trans>Quản lý thông tin hồ sơ để bảo mật tài khoản</Trans>
        </p>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit} noValidate>
        <div className='mt-6 grow md:mt-0 md:pr-12'>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:pr-2 sm:text-right'>
              <Trans>Mật khẩu hiện tại:</Trans>
            </div>
            <div className='ms:pl-5 sm:w-[70%]'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                className='relative'
                classNameEye='absolute top-[8px] right-[5px] size-5 cursor-pointer'
                name='password'
                placeholder='Password'
                type='password'
                errorsMessage={errors.password?.message}
              ></Input>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:pr-2 sm:text-right'>
              <Trans>Mật khẩu mới:</Trans>
            </div>
            <div className='ms:pl-5 sm:w-[70%]'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative'
                classNameEye='absolute top-[8px] right-[5px] size-5 cursor-pointer'
                register={register}
                name='new_password'
                placeholder='Enter new password'
                type='password'
                errorsMessage={errors.new_password?.message}
              ></Input>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:pr-2 sm:text-right'>
              <Trans>Nhập lại mật khẩu mới:</Trans>
            </div>
            <div className='ms:pl-5 sm:w-[70%]'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative'
                classNameEye='absolute top-[8px] right-[5px] size-5 cursor-pointer'
                register={register}
                name='confirm_password'
                placeholder='Enter new password again'
                type='password'
                errorsMessage={errors.confirm_password?.message}
              ></Input>
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[30%] sm:pr-2 sm:text-right' />
            <div className='ms:pl-5 sm:w-[70%]'>
              <Button
                className='flex h-9 items-center bg-orange-600 px-5 text-center text-sm text-white hover:bg-orange-600/80'
                type='submit'
              >
                <Trans>Lưu</Trans>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

export default ChangePassword
