import { InfrastructureModule } from '@infrastructure/infrastructure.module'
import { UsersModule } from '@modules/users/users.module'
import { Module } from '@nestjs/common'
import { AuthenticationModule } from './modules/authentication/authentication.module'

@Module({
  imports: [AuthenticationModule, UsersModule, InfrastructureModule],
  controllers: [],
  providers: []
})
export class AppModule {}
