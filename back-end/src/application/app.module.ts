import { Module } from '@nestjs/common'
import { UseCasesModule } from 'src/use-cases/use-cases.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { UsersController } from './controllers/users.controller'
import { GuardsModule } from './guards/guards.module'
import { CertificatesController } from './controllers/certificates.controller'
import { SignaturesController } from './controllers/signatures.controller'

@Module({
  imports: [UseCasesModule, GuardsModule],
  providers: [],
  controllers: [
    AuthenticateController,
    UsersController,
    CertificatesController,
    SignaturesController,
  ],
})
export class AppModule {}
