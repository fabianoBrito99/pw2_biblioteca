import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, user: any) => void): void {
    done(null, { id: user.id_usuario, nome: user.nome_usuario });
  }

  deserializeUser(payload: any, done: (err: any, user: any) => void): void {
    done(null, payload);
  }
}
