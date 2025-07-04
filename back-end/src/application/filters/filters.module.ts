import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ZodExceptionFilter } from './zod-exception.filter'
import { JwtExceptionFilter } from './jwt-exception.filter'

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ZodExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
  ],
})
export class FiltersModule {}
