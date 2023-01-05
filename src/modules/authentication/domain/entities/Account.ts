import { Address } from '../../presentation/dto/types/Address'

export class Account {
  private name: string
  public email: string
  private age: number
  public address: Address
  
  constructor({ name, email, age, address }) {
    this.name = name
    this.email = email
    this.age = age
    this.address = address
  }
}
