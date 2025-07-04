import { UnauthorizedException } from '@nestjs/common'

export class InvalidCredentialsError extends UnauthorizedException {
  constructor() {
    super('Credenciais inválidas')
  }
}
