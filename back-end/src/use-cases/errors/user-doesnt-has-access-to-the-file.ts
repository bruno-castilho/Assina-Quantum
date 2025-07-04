import { BadRequestException } from '@nestjs/common'

export class UserDoesntHasAccessToTheFile extends BadRequestException {
  constructor() {
    super('Usuario não tem acesso ao arquivo')
  }
}
