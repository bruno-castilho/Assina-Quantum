import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { JsonWebTokenError } from 'jsonwebtoken'
import { FastifyReply } from 'fastify'

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    response.status(401).send({
      message: 'Token JWT inválido ou expirado',
      details: exception.message,
    })
  }
}
