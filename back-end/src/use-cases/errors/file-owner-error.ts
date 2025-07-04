import { ForbiddenException } from '@nestjs/common'

export class FileOwnerError extends ForbiddenException {
  constructor() {
    super('Usuario é proprietário do arquivo')
  }
}
