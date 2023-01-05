import { Module } from '@nestjs/common'
import { AuthenticationClient } from '../../infrastructure/clients/AuthenticationClient'
import { InfrastructureModule } from '../../infrastructure/infrastructure.module'
import { AuthenticationService } from './application/authentication.service'
import { AuthenticationController } from './presentation/authentication.controller'

@Module({
  imports: [InfrastructureModule],  
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'IAuthenticationClient',
      useClass: AuthenticationClient
    }
  ]
})
export class AuthenticationModule {}
