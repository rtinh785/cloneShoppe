import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import userApi, { type BodyUpdateProfile } from '../../../../apis/user.api'
import { userSchema, type UserSchema } from '../../../../utils/rules'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputNumber from '../../../../components/InputNumber'
import { useContext, useEffect, useMemo, useState } from 'react'
import DateSelect from '../../components/DataSelect/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from '../../../../context/app.context'
import { setProfileToLS } from '../../../../utils/auth'
import { getAvatarURL, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import type { ErroResponse } from '../../../../types/utils.type'
import InputFile from '../../../../components/InputFile/InputFile'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick([
  'name',
  'address',
  'phone',
  'date_of_birth',
  'avatar'
]) as yup.ObjectSchema<FormData>

const Profile = () => {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

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
      name: '',
      address: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1),
      avatar: ''
    },
    resolver: yupResolver(profileSchema)
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const avatar = watch('avatar')

  const { data: profileData, isFetching } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        autoClose: 1000,
        position: 'top-left'
      })
      setProfile(data.data.data)
      setProfileToLS(data.data.data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })
  const onSubmit = handleSubmit(async (data) => {
    let avatarName = avatar
    try {
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      await updateUserMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      } as BodyUpdateProfile)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErroResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChange = (file?: File) => {
    setFile(file)
  }

  return (
    <section className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Hồ sơ của tôi</h1>
        <p className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit} noValidate>
        <div className='mt-6 grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:sm:w-[20%] sm:sm:text-right'>Email:</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Tên:</div>
            <div className='ms:pl-5 sm:w-[80%]'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorsMessage={errors.name?.message}
              ></Input>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Số điện thoại:</div>
            <div className='ms:pl-5 sm:w-[80%]'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                    }}
                  ></InputNumber>
                )}
              />
              <p className='mt-1 min-h-5 text-sm text-red-600'>{errors.phone?.message}</p>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Địa chỉ:</div>
            <div className='ms:pl-5 sm:w-[80%]'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                name='address'
                placeholder='Địa chỉ'
                register={register}
                errorsMessage={errors.address?.message}
              ></Input>
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => {
              return (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )
            }}
          />

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right' />
            <div className='ms:pl-5 sm:w-[80%]'>
              <Button
                className='flex h-9 items-center bg-orange-600 px-5 text-center text-sm text-white hover:bg-orange-600/80'
                type='submit'
                disabled={isFetching}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 size-24'>
              <img
                src={previewImage || getAvatarURL(avatar)}
                alt='haha'
                className='size-full rounded-full object-cover'
              />
            </div>
            <InputFile onChange={handleChange}></InputFile>
            <div className='mt-3 text-gray-400'>
              <div>Dung lượng file tối đa 1MB</div>
              <div>Định dạng: JPEG, PNG</div>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Profile
