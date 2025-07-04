import { Module } from '@nestjs/common'
import { UseCasesModule } from 'src/use-cases/use-cases.module'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [UseCasesModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class GuardsModule {}
