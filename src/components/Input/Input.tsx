import type { InputHTMLAttributes } from 'react'
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  errorsMessage?: string
  classNameInput?: string
  classNameError?: string
  name: Path<T>
  register?: UseFormRegister<T>
}

const Input = <T extends FieldValues>({
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-5 text-sm',
  errorsMessage,
  className,
  name,
  register,
  ...rest
}: Props<T>) => {
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <p className={classNameError}>{errorsMessage}</p>
    </div>
  )
}

export default Input
