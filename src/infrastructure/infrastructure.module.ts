import { AuthenticationClient } from './clients/AuthenticationClient'
import { Module } from '@nestjs/common'

@Module({
  imports: [],  
  controllers: [],
  providers: [
    AuthenticationClient
  ],
  exports: []
})
export class InfrastructureModule {}
