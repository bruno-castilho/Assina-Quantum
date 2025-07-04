import { ConflictException } from '@nestjs/common'

export class UserAlreadyHasCertificate extends ConflictException {
  constructor() {
    super('Usuario já tem um certificado')
  }
}
