import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

import { AuthGuard } from '../guards/auth.guard'
import { SignaturesUseCases } from 'src/use-cases/signatures.service'
import { MultipartFile } from '@fastify/multipart'
import { Readable } from 'stream'

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesUseCase: SignaturesUseCases) {}

  @Post('')
  @UseGuards(AuthGuard)
  async signDocument(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }

    const parts = req.parts()

    let document: Buffer | null = null
    let secret_key: Buffer | null = null

    for await (const part of parts) {
      if (part.type === 'file') {
        const file = part as MultipartFile
        const chunks: Buffer[] = []

        for await (const chunk of file.file as Readable) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        }

        const buffer = Buffer.concat(chunks)

        if (file.fieldname === 'document') {
          document = buffer
        } else if (file.fieldname === 'secret_key') {
          secret_key = buffer
        }
      }
    }

    if (!document)
      throw new BadRequestException(
        'Documento para assinatura não foi encontrado.',
      )

    if (!secret_key)
      throw new BadRequestException(
        'Chave privada para assinatura não foi encontrada.',
      )

    const { signature } = await this.signaturesUseCase.signDocument({
      userId,
      document,
      secret_key,
    })

    res.status(HttpStatus.OK)
    return signature
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifySign(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }

    const parts = req.parts()

    let document: Buffer | null = null
    let signature: Buffer | null = null

    for await (const part of parts) {
      if (part.type === 'file') {
        const file = part as MultipartFile
        const chunks: Buffer[] = []

        for await (const chunk of file.file as Readable) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        }

        const buffer = Buffer.concat(chunks)

        if (file.fieldname === 'document') {
          document = buffer
        } else if (file.fieldname === 'signature') {
          signature = buffer
        }
      }
    }

    if (!document) throw new BadRequestException('Documento não encontrado.')

    if (!signature) throw new BadRequestException('Assinatura não encontrada.')

    const signatureIsValid = await this.signaturesUseCase.verifySign({
      userId,
      document,
      signature,
    })

    res.status(HttpStatus.OK)
    return {
      message: signatureIsValid ? 'Assinatura valida' : 'Assinatura invalida',
    }
  }
}
