import { useState } from 'react'
import InputNumber, { type InputNumberProps } from '../InputNumber'

interface QuantityControllerProps extends InputNumberProps {
  max?: number
  OnIncrease?: (value: number) => void
  OnDecrease?: (value: number) => void
  OnType?: (value: number) => void
  OnFocusOut?: (value: number) => void
  classNameWrapper?: string
}

const QuantityController = ({
  max,
  OnIncrease,
  OnDecrease,
  OnType,
  OnFocusOut,
  classNameWrapper = 'ml-10',
  value,
  ...rest
}: QuantityControllerProps) => {
  const [localValue, setlocalValue] = useState<number>(Number(value) || 1)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    if (OnType) {
      OnType(_value)
    }
    setlocalValue(_value)
  }

  const increase = () => {
    let _value = value ? Number(value) + 1 : localValue + 1
    if (max !== undefined && _value > max) {
      _value = max
    }

    if (OnIncrease) {
      OnIncrease(_value)
    }
    setlocalValue(_value)
  }

  const decrease = () => {
    let _value = value ? Number(value) - 1 : localValue - 1
    if (_value < 1) {
      _value = 1
    }

    if (OnDecrease) {
      OnDecrease(_value)
    }
    setlocalValue(_value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (OnFocusOut) {
      OnFocusOut(Number(e.target.value))
    }
  }

  return (
    <div className={'item-center flex ' + classNameWrapper}>
      <button
        className='flex size-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        onClick={decrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <InputNumber
        value={value || localValue}
        className=''
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      ></InputNumber>
      <button
        className='flex size-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
        onClick={increase}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}

export default QuantityController
