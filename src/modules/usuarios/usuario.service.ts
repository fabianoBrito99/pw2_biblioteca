import { Injectable } from '@nestjs/common';
import { Usuario } from '../../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  async findById(id: number): Promise<Usuario | undefined> {
    return await Usuario.findOne({ where: { id_usuario: id } });
  }
}
