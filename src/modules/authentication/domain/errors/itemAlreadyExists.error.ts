export class ItemAlreadyExistsError extends Error {
  constructor(paramName: string, givenName: string) {
    super(`A ${paramName} with the given ${givenName} already exists.`)
    this.name = 'ItemAlreadyExistsError'
  }
}
