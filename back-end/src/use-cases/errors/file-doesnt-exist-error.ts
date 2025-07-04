import { NotFoundException } from '@nestjs/common'

export class FileDoesntExistError extends NotFoundException {
  constructor() {
    super('Arquivo não existe')
  }
}
