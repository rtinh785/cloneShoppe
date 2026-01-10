import { range } from 'lodash'
import { useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

const DateSelect = ({ onChange, value, errorMessage }: Props) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: newValue } = e.target
    const newDate = {
      date: value?.getDate() || 1,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1990,
      [name]: Number(newValue)
    }
    setDate(newDate)
    if (onChange) {
      onChange(new Date(newDate.year, newDate.month, newDate.date))
    }
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:pr-2 sm:text-right'>Ngày sinh:</div>
      <div className='ms:pl-5 sm:w-[80%]'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange-600'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32, 1).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange-600'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12, 1).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange-600'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, new Date().getFullYear() + 5, 1).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <p className='mt-1 min-h-5 text-sm text-red-600'>{errorMessage}</p>
      </div>
    </div>
  )
}

export default DateSelect
