import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseFilters,
  UseGuards,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Página de login */
  @Get('/login')
  @Render('auth/login')
  loginPage(@Request() req) {
    return { message: req.flash('loginError')[0] || null, hideMenu: true };
  }

  /** Processar login */
  @Post('/login')
  async login(@Request() req, @Body() body, @Res() res: Response) {
    try {
      const { nome_usuario, senha } = body;
      const usuario = await this.authService.login(nome_usuario, senha);

      if (!usuario) {
        req.flash('loginError', 'Usuário ou senha inválidos.');
        return res.redirect('/auth/login');
      }

      req.session.user = usuario; 
      req.session.save(() => { 
        return res.redirect('/livros');
      });

    } catch (error) {
      req.flash('loginError', 'Usuário ou senha inválidos.');
      return res.redirect('/auth/login');
    }
  }

 /** Página de registro */
 @Get('/register')
 @Render('auth/register')
 registerPage(@Request() req) {
   return {
     successMessage: req.flash('successMessage')[0] || null,
     errorMessage: req.flash('errorMessage')[0] || null,
     hideMenu: true
   };
 }

 /** Processar cadastro */
 @Post('/register')
 async register(@Request() req, @Body() body, @Res() res: Response) {
   try {
     await this.authService.register(body);
     req.flash('successMessage', 'Conta criada com sucesso! Redirecionando para login...');
     return res.redirect('/auth/register'); // Redireciona para exibir a mensagem antes do login
   } catch (error) {
     req.flash('errorMessage', error.message);
     return res.redirect('/auth/register'); // Redireciona para exibir a mensagem de erro
   }
 }

  /** Página inicial (home) */
  @UseGuards(AuthenticatedGuard)
  @Get('/home')
  @Render('home')
  getHome(@Request() req) {
    return { user: req.session.user || null };
  }

  /** Página de perfil do usuário */
  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  @Render('auth/profile')
  getProfile(@Request() req) {
    return { user: req.session.user || null };
  }

  /** Logout e destruição da sessão */
  @Get('/logout')
  logout(@Request() req, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
}
