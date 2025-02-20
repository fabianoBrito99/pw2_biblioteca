import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { usuarioModule } from '../usuarios/usuario.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    usuarioModule, // 🔹 Adicionado para garantir que o UsuarioService esteja disponível
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
