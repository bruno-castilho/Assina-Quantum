import { NotFoundException } from '@nestjs/common'

export class CertificateDoesntExistError extends NotFoundException {
  constructor() {
    super('Certificado não existe')
  }
}
