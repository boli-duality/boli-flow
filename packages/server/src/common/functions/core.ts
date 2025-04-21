/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export async function doAwait<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}

/** 进行延时，以达到可以简写代码的目的 比如: await sleep(20)将会阻塞20ms */
export const sleep = (gap = 60) => new Promise<void>((r) => setTimeout(() => r(), gap))
