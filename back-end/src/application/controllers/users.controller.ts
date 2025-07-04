import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthGuard } from 'src/application/guards/auth.guard'

import { UsersUseCases } from 'src/use-cases/users.service'
import { z } from 'zod'

@Controller('users')
export class UsersController {
  constructor(private readonly usersUseCases: UsersUseCases) {}

  @Post('')
  async register(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um nome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O nome deve conter apenas letras',
        }),

      last_name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um sobrenome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O sobrenome deve conter apenas letras',
        }),

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

    const { name, email, last_name, password } = bodySchema.parse(req.body)
    const { user } = await this.usersUseCases.register({
      name,
      email,
      last_name,
      password,
    })

    res.status(HttpStatus.CREATED)
    return {
      user,
      message: 'Cadastro efetuado com sucesso',
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async profile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um nome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O nome deve conter apenas letras',
        }),

      last_name: z
        .string()
        .trim()
        .min(1, { message: 'Digite um sobrenome' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
          message: 'O sobrenome deve conter apenas letras',
        }),

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
      new_password: z
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
        })
        .optional(),
    })

    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestException('Esta rota necessita de autenticação')
    }

    const { name, email, last_name, password, new_password } = bodySchema.parse(
      req.body,
    )
    const { user } = await this.usersUseCases.updateProfile({
      userId,
      name,
      email,
      last_name,
      password,
      new_password,
    })

    res.status(HttpStatus.OK)
    return {
      user,
      message: 'Perfil atualizado com sucesso',
    }
  }
}
