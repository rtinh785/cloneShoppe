import * as yup from 'yup'

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
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp')
})

export const schemaLogin = schema.omit(['confirm_password'])

export type FormData = yup.InferType<typeof schema>
export type FormDataLogin = Omit<FormData, 'confirm_password'>
