import { Controller, Get, Render } from '@nestjs/common';
import { LivrosService } from './livros.service';

@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Get()
  @Render('livros') 
  async listarLivros() {
    const livros = await this.livrosService.findAll();
    return { livros }; 
  }
}
