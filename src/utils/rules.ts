import * as yup from 'yup'

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

function testValue(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent
  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Bắt buộc phải nhập email!')
    .email('Email không đúng định dạng!')
    .min(6, 'Độ dài phải từ 5 - 160 kí tự!')
    .max(160, 'Độ dài phải từ 5 - 160 kí tự!'),
  password: yup
    .string()
    .required('Bắt buộc phải nhập password!')
    .min(6, 'Độ dài phải từ 6 - 160 kí tự!')
    .max(160, 'Độ dài phải từ 6 - 160 kí tự!'),
  confirm_password: yup
    .string()
    .required('Nhập lại password là bắt buộc!')
    .min(6, 'Độ dài phải từ 6 - 160 kí tự!')
    .max(160, 'Độ dài phải từ 6 - 160 kí tự!')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp'),
  price_min: yup
    .string()
    .optional()

    .test({
      name: 'price-require',
      message: 'Vui lòng nhập giá trị!',
      test: testValue
    })
    .test({
      name: 'price-not-allowed',
      message: 'Giá bên trái phải nhỏ hơn bên phải!',
      test: testPriceMinMax
    }),
  price_max: yup
    .string()
    .optional()
    .test({
      name: 'price-require',
      message: 'Vui lòng nhập giá trị!',
      test: testValue
    })
    .test({
      name: 'price-not-allowed',
      message: 'Giá bên trái phải nhỏ hơn bên phải!',
      test: testPriceMinMax
    })
})

export const schemaRegister = schema.omit(['price_min', 'price_max'])
export const schemaLogin = schema.omit(['confirm_password', 'price_min', 'price_max'])
export const schemaPrice = schema.pick(['price_min', 'price_max']) as yup.ObjectSchema<{
  price_min?: string
  price_max?: string
}>

export type FormData = yup.InferType<typeof schema>
export type FormDataLogin = yup.InferType<typeof schemaLogin>
export type FormDataPrice = yup.InferType<typeof schemaPrice>
