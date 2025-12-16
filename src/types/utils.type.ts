export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErroResponse<Data> {
  message: string
  data?: Data
}

export type NoUndefinedFied<T> = {
  [P in keyof T]-?: NoUndefinedFied<NonNullable<T[P]>>
}
