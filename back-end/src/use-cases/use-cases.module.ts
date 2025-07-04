import { Module } from '@nestjs/common'
import { RepositoriesModule } from 'src/persistence/repositories/repositories.module'
import { FileSystemModule } from 'src/persistence/file-system/file-system.module'
import { AuthenticateUseCases } from './authenticate.service'
import { UsersUseCases } from './users.service'
import { DockerService } from 'src/lib/dockernode.service'
import { JwtModule } from '@nestjs/jwt'
import { env } from 'src/env'
import { CertificatesUseCases } from './certificates.service'
import { SignaturesUseCases } from './signatures.service'

@Module({
  imports: [
    RepositoriesModule,
    FileSystemModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    DockerService,
    AuthenticateUseCases,
    UsersUseCases,
    CertificatesUseCases,
    SignaturesUseCases,
  ],
  exports: [
    AuthenticateUseCases,
    UsersUseCases,
    CertificatesUseCases,
    SignaturesUseCases,
  ],
})
export class UseCasesModule {}
