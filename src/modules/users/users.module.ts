import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { Module } from '@nestjs/common'
import { InfrastructureModule } from '../../infrastructure/infrastructure.module'
import { UsersController } from './presentation/UsersController'
import { UsersInjectionList } from './UsersInjectionList'

@Module({
  imports: [InfrastructureModule],  
  controllers: [UsersController],
  providers: [
    UsersInjectionList.AUTHENTICATION_SERVICE,
    InfrastructureInjectionList.AUTHENTICATION_CLIENT
  ]
})
export class UsersModule {}
