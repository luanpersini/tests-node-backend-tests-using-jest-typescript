import { AuthenticationModule } from './modules/authentication/authentication.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  providers: []
})
export class AppModule {}
