import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../../entities/usuario.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usuarioService: UsuarioService) {
    super();
  }

  /** Salva apenas o ID do usuário na sessão */
  serializeUser(user: any, done: Function) {
    console.log('🔹 Serializando usuário:', user);
    done(null, { id_usuario: user.id_usuario, nome_usuario: user.nome_usuario });
  }

  /** Recupera o usuário completo da sessão */
  async deserializeUser(payload: any, done: Function) {
    console.log('🔹 Desserializando usuário ID:', payload.id_usuario);
    if (!payload.id_usuario) {
      return done(new Error('ID do usuário não encontrado na sessão'), null);
    }
    const usuario = await this.usuarioService.findById(payload.id_usuario);
    return usuario ? done(null, usuario) : done(null, null);
  }
}
