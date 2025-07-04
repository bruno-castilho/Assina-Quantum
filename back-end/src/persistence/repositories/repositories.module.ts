import { Module } from '@nestjs/common'
import {
  PrismaCertificatesRepository,
  PrismaUsersRepository,
} from './prisma-repository.service'
import { PrismaService } from 'src/lib/prisma.service'

@Module({
  providers: [
    PrismaService,
    PrismaUsersRepository,
    PrismaCertificatesRepository,
  ],
  exports: [PrismaUsersRepository, PrismaCertificatesRepository],
})
export class RepositoriesModule {}
