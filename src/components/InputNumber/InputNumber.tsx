import { forwardRef, useState, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorsMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(
  (
    {
      classNameInput = 'p-3 w-full outline-none b order border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
      className,
      onChange,
      value = '',
      ...rest
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (/^\d*$/.test(value) || value === '') {
        if (onChange) {
          onChange(e)
        }
        setLocalValue(value)
      }
    }

    return (
      <div className={className}>
        <input ref={ref} className={classNameInput} onChange={handleChange} value={value || localValue} {...rest} />
      </div>
    )
  }
)

export default InputNumber
