import { Injectable } from '@nestjs/common'
import { PrismaUsersRepository } from 'src/persistence/repositories/prisma-repository.service'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'

@Injectable()
export class AuthenticateUseCases {
  constructor(
    private usersRepository: PrismaUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(params: { email: string; password: string }) {
    const { email, password } = params

    const user = await this.usersRepository.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new InvalidCredentialsError()

    const { password_hash, ...userWithoutPassword } = user

    const doesPasswordMatches = await compare(password, password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    const access_token = await this.jwtService.signAsync(userWithoutPassword)

    return {
      access_token,
      user: userWithoutPassword,
    }
  }

  async logged(params: { access_token: string }) {
    const { access_token } = params

    const { id } = await this.jwtService.verifyAsync(access_token)

    const user = await this.usersRepository.findUnique({
      omit: {
        password_hash: true,
      },
      where: {
        id,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const newAccessToken = await this.jwtService.signAsync(user)

    return {
      access_token: newAccessToken,
      user,
    }
  }

  async verifyAcess(params: { access_token: string }) {
    const { access_token } = params

    const user = await this.jwtService.verifyAsync(access_token)

    return {
      user,
    }
  }
}
