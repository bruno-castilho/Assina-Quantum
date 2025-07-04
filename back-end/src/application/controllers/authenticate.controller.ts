import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AuthenticateUseCases } from 'src/use-cases/authenticate.service'

@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly autenticateUseCase: AuthenticateUseCases) {}

  @Post('login')
  async login(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const bodySchema = z.object({
      email: z.string().trim().email({ message: 'E-mail inválido' }),

      password: z
        .string()
        .trim()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
        .regex(/(?=.*[A-Z])/, {
          message: 'A senha deve conter pelo menos uma letra maiúscula',
        })
        .regex(/(?=.*[0-9])/, {
          message: 'A senha deve conter pelo menos um número',
        })
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
          message: 'A senha deve conter pelo menos um símbolo especial',
        }),
    })

    const { email, password } = bodySchema.parse(req.body)

    const { user, access_token } = await this.autenticateUseCase.login({
      email,
      password,
    })

    res
      .setCookie('access_token', access_token, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(HttpStatus.OK)
    return {
      user,
      message: `Olá, ${user.name}! Que bom ter você por aqui 😊`,
    }
  }

  @Get('logged')
  async logged(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const access_token = req.cookies.access_token

    if (!access_token) throw new UnauthorizedException()

    const { user, access_token: accessToken } =
      await this.autenticateUseCase.logged({
        access_token,
      })

    res
      .setCookie('access_token', accessToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(HttpStatus.OK)
    return {
      user,
      message: `Bem-vindo de volta, ${user.name}! 😊 Sentimos sua falta.`,
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.status(HttpStatus.OK).clearCookie('access_token', {
      path: '/',
    })

    res.status(HttpStatus.OK)
    return {
      message: 'Você saiu da sessão. Vamos sentir sua falta... 😔',
    }
  }
}
