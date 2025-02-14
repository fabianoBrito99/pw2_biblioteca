import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);
    
    if (request.user) {
      request.session.user = {
        id_usuario: request.user.id_usuario,
        nome_usuario: request.user.nome_usuario,
      };
    }

    return result;
  }
}
