import { NotFoundException } from '@nestjs/common'

export class UserDoesntExistError extends NotFoundException {
  constructor() {
    super('Usuário não existe')
  }
}
