import { Injectable } from '@nestjs/common'
import { PrismaUsersRepository } from 'src/persistence/repositories/prisma-repository.service'
import { compare, hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

@Injectable()
export class UsersUseCases {
  constructor(private usersRepository: PrismaUsersRepository) {}

  async register(params: {
    name: string
    last_name: string
    email: string
    password: string
  }) {
    const { name, last_name, email, password } = params

    const userWithSameEmail = await this.usersRepository.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      omit: { password_hash: true },
      data: {
        name,
        last_name,
        email,
        password_hash,
      },
    })

    return { user }
  }

  async updateProfile(params: {
    userId: string
    name: string
    last_name: string
    email: string
    password: string
    new_password?: string
  }) {
    const { userId, name, last_name, email, password, new_password } = params

    let user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    const changedEmail = user.email !== email

    if (changedEmail) {
      const userWithSameEmail = await this.usersRepository.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) throw new UserAlreadyExistsError()
    }

    const password_hash = new_password
      ? await hash(new_password, 6)
      : new_password

    user = await this.usersRepository.update({
      omit: { password_hash: true },
      data: {
        name,
        last_name,
        email,
        password_hash,
      },
      where: {
        id: userId,
      },
    })
    return { user }
  }
}
