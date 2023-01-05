import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { Module } from '@nestjs/common'
import { InfrastructureModule } from '../../infrastructure/infrastructure.module'
import { AuthenticationInjectionList } from './AuthenticationInjectionList'
import { AuthenticationController } from './presentation/AuthenticationController'

@Module({
  imports: [InfrastructureModule],  
  controllers: [AuthenticationController],
  providers: [
   AuthenticationInjectionList.AUTHENTICATION_SERVICE,
   InfrastructureInjectionList.AUTHENTICATION_CLIENT
  ]
})
export class AuthenticationModule {}
