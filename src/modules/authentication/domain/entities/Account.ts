import { Address } from '../interfaces/Address'

export class Account {
  private name: string
  private email: string
  private age: string
  public address: Address
  
  constructor({ name, email, age, address }) {
    this.name = name
    this.email = email
    this.age = age
    this.address = address
  }
}
