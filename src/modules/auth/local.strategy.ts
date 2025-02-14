import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'nome_usuario' }); // Define o campo do formulário como 'nome_usuario'
  }

  async validate(nome_usuario: string, senha: string) {
    const user = await this.authService.login(nome_usuario, senha);
    if (!user) {
      throw new UnauthorizedException('Nome de usuário ou senha incorretos');
    }

    return user;
  }
}
