import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthenticateUseCases } from 'src/use-cases/authenticate.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticateUseCases: AuthenticateUseCases) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const access_token = request.cookies.access_token

    if (!access_token) throw new UnauthorizedException()

    const { user } = await this.authenticateUseCases.verifyAcess({
      access_token,
    })

    request.user = user

    return true
  }
}
