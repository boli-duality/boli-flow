export class ApiResult<T> {
  code: number
  msg: string
  data: T

  static ok<T>(data?: T, msg: string = 'ok'): ApiResult<T> {
    const response = new ApiResult<T>()

    response.code = 0
    response.msg = msg
    if (data) response.data = data

    return response
  }

  static okMsg<T>(msg: string): ApiResult<T> {
    const response = new ApiResult<T>()

    response.code = 0
    response.msg = msg

    return response
  }

  static biz<T>(data: T, code: number, msg: string = 'biz'): ApiResult<T> {
    const response = new ApiResult<T>()

    response.code = code
    response.msg = msg
    if (data) response.data = data

    return response
  }
}
