import type { Categories } from '../types/category.type'
import type { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Categories>>(URL)
  }
}

export default categoryApi
