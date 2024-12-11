import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { DatabaseModule } from '../../database/database.module';
import { Livro } from '../../entities/livro.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Livro]),  
    DatabaseModule, 
  ],
  providers: [LivrosService],  
  controllers: [LivrosController], 
})
export class LivrosModule {}
