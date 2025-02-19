export interface Livro {
  id_livro: number;
  nome_livro: string;
  quantidade_paginas: number;
  descricao: string;
  ano_publicacao: number;
  categorias: { id_categoria: number; nome_categoria: string }[]; 
  quantidade_estoque: number;
}
