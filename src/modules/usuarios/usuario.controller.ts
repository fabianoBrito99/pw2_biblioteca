import { Controller, Get, Request, UseGuards, Render } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
@UseGuards(AuthenticatedGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /** Página de Perfil do Usuário */
  @Get('perfil')
  @Render('perfil')
  async getPerfil(@Request() req) {
    console.log('🔹 Usuário na sessão:', req.user);
  
    if (!req.user) {
      throw new Error('Usuário não autenticado.');
    }
  
    const usuario = await this.usuarioService.findById(req.user.id_usuario);
    return { usuario };
  }
  
}
