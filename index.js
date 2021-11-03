import axios from 'axios'

const errorAxios = axios.create()
errorAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
errorAxios.defaults.withCredentials = false
errorAxios.defaults.timeout = 2000
errorAxios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
errorAxios.interceptors.response.use(
  (response) => {
    let res = null
    res = response.data
    return res
  },
  (error) => {
    return Promise.reject(new ApiError(error))
  }
)

export default class ErrorCodeTool {
  #errorMap = []
  #errorKey = 'errorCode'

  /**
   * @description 存储错误码
   * @param {*} errorCode
   */
  setLocalErrorCode(errorCode) {
    const data = JSON.stringify(errorCode)
    localStorage.setItem(this.errorKey, data)
  }

  /**
   * @description 获取错误码
   * @param {*} errorCode
   */
  getLocalErrorCode() {
    try {
      const data = localStorage.getItem(this.errorKey)
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }
  /**
   * 获取errorCode json配置文件
   * @returns {Promise<any | never>}
   */
  async initErrorMap(params) {
    const data = await errorAxios({
      url: 'https://cdn.fed.hzmantu.com/error_code_build.json?t=cross_origin',
      method: 'GET',
      params,
    })
    this.setLocalErrorCode(data)
    return data
  }

  async getErrorMap() {
    let errorConfig = this.getLocalErrorCode()
    if (!errorConfig) {
      errorConfig = await this.initErrorMap()
    }
    const errorArray = Object.entries(errorConfig)
    const data = new Map(errorArray.map((item) => [Number(item[0]), item[1]]))
    return data
  }
}
