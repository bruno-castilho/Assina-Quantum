import { ConflictException } from '@nestjs/common'

export class UserAlreadyExistsError extends ConflictException {
  constructor() {
    super('E-mail já existe')
  }
}
