import { AuthenticationClient } from '../../infrastructure/clients/AuthenticationClient'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'
import { InfrastructureModule } from '../../infrastructure/infrastructure.module'
import { Module } from '@nestjs/common'

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
