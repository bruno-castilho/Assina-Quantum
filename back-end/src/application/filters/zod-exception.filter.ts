import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    response.status(400).send({
      message: 'Erro de validação',
      issues: exception.format(),
    })
  }
}
