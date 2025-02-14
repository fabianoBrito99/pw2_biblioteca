import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Usuario } from '../../entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  private usuarioRepository;

  constructor(private dataSource: DataSource) {
    this.usuarioRepository = this.dataSource.getRepository(Usuario);
  }

  async validateUser(nome_usuario: string, senha: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { nome_usuario } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      throw new UnauthorizedException('Nome de usuário ou senha incorretos');
    }

    return {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
    };
  }

  async login(nome_usuario: string, senha: string) {
    const usuario = await this.validateUser(nome_usuario, senha);
    return { message: 'Login bem-sucedido', usuario };
  }


  async register(dados: any) {
    const { nome_usuario, email, senha, telefone, cep, rua, bairro, numero } = dados;

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    // Criptografar senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = Usuario.create({
      nome_usuario,
      email,
      senha: senhaCriptografada,
      telefone,
      cep,
      rua,
      bairro,
      numero,
    });

    await usuario.save();
    return { message: 'Usuário cadastrado com sucesso!' };
  }
}