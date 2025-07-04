import { ForbiddenException } from '@nestjs/common'

export class NotCetificateOwnerError extends ForbiddenException {
  constructor() {
    super('Usuario não é proprietário do certificado')
  }
}
