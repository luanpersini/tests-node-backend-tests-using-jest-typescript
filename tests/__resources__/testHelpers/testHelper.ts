export const throwError = (): never => {
  throw new Error('Sync Error')
}

export const throwReject = async () => {
  throw new Error('Async Error')
}