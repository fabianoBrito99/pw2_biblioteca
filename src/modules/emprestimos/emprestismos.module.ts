import { Module } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { EmprestimosController } from './emprestimos.controller';

@Module({
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
  exports: [EmprestimosService], 
})
export class EmprestimosModule {}
