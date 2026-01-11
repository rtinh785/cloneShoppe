import React, { useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file?: File) => void
}

const MAXSILE_UPLOAD = 1048576

const InputFile = ({ onChange }: Props) => {
  const chooseFileImage = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal?.size >= MAXSILE_UPLOAD || !fileFromLocal.type.includes('image'))) {
      toast.error('File quá lớn hoặc không đúng định dạng quy định')
    } else {
      if (onChange) {
        onChange(fileFromLocal)
      }
    }
  }

  const handleUpload = () => {
    chooseFileImage.current?.click()
  }
  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={chooseFileImage}
        onChange={onFileChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </>
  )
}

export default InputFile
