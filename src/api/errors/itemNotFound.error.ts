export class ItemNotFoundError extends Error {
  constructor(paramName: string, givenName: string) {
    super(`The ${paramName} with the given ${givenName} was not found.`)
    this.name = 'ItemNotFoundError'
  }
}