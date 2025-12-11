import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface Props<T extends FieldValues> {
  type: string
  errorsMessage?: string
  placeHolder?: string
  className?: string
  name: Path<T>
  register: UseFormRegister<T>
}

const Input = <T extends FieldValues>({ type, errorsMessage, placeHolder, className, name, register }: Props<T>) => {
  return (
    <div className={className}>
      <input
        type={type}
        className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
        placeholder={placeHolder}
        {...register(name)}
      />
      <div className='mt-1 text-red-600 min-h-5 text-sm'>{errorsMessage}</div>
    </div>
  )
}

export default Input
