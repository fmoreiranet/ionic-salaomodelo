import { v4 as uuid } from 'uuid';
export class User {
    _id: string = '';
    nome: string = "";
    telefone: string = "";
    foto: string = "";
    email: string = "";
    senha: string = "";
    ativo: boolean = true;
}
