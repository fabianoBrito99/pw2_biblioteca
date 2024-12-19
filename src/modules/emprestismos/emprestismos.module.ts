import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprestimos } from '../../entities/emprestismos.entity';
import { EmprestimosService } from './emprestimos.service';
import { EmprestimosController } from './emprestimos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Emprestimos])],
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
})
export class EmprestimosModule {}
