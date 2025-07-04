import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CertificatesUseCases } from 'src/use-cases/certificates.service'
import { AuthGuard } from '../guards/auth.guard'
import { z } from 'zod'

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesUseCase: CertificatesUseCases) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createCertificate(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }
    const { secret_key } = await this.certificatesUseCase.createCertificate({
      userId,
    })

    res
      .status(HttpStatus.OK)
      .header('Content-Type', 'text/plain')
      .header('Content-Disposition', 'attachment; filename="secret_key.sec"')
      .status(HttpStatus.OK)
      .send(secret_key)
  }

  @Get('mycertificate')
  @UseGuards(AuthGuard)
  async myCertificate(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }
    const { certificate } = await this.certificatesUseCase.myCertificate({
      userId,
    })

    res.status(HttpStatus.OK)

    return {
      certificate,
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeCertificate(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação.')
    }

    const { id: certificateId } = paramsSchema.parse(req.params)

    this.certificatesUseCase.removeCertificate({
      userId,
      certificateId,
    })

    res.status(HttpStatus.OK)
    return {
      message: 'Certificado removido com sucesso',
    }
  }
}
