import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../../entities/categoria.entity';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { LivroCategoria } from 'src/entities/livro_categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
