import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Importando todas as entidades corretamente
import { Livro } from '../entities/livro.entity';
import { Categoria } from '../entities/categoria.entity';
import { Estoque } from '../entities/estoque.entity';
import { Autor } from '../entities/autor.entity';
import { Emprestimos } from '../entities/emprestimos.entity';
import { LivroCategoria } from '../entities/livro_categoria.entity';


@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pw2_biblioteca',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, 
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
