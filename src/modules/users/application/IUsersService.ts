import { GetAccountResponseDto } from '../presentation/dto/getAccountResponseDto'

export interface IUsersService {
  listAllUsers(): Promise<GetAccountResponseDto[]>
  getUserById(id: string): Promise<GetAccountResponseDto>
}
