import { AuthenticationClient } from '@infrastructure/clients/AuthenticationClient'
import { Module } from '@nestjs/common'
import { InfrastructureModule } from '../../src/infrastructure/infrastructure.module'
import { TestService } from './TestService'

@Module({
  imports: [InfrastructureModule],
  controllers: [],
  providers: [
    {
      provide: 'IAuthenticationClient',
      useClass: AuthenticationClient
    },
    TestService
  ],
  exports: [TestService]
})
export class TestModule {}
