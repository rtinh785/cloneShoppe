export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErroResponse<Data> {
  message: string
  data?: Data
}
