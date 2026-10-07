export type Produto = {
  idProduto: number;
  descricao: string;
  validade: string | null;
  preco: number;
  qtdEstoque: number;
  qtdMinEstoque: number;
  emAlerta?: boolean;
};

export type ProdutoForm = {
  descricao: string;
  validade: string;
  preco: number;
  qtdEstoque: number;
  qtdMinEstoque: number;
};

export type Cliente = {
  idCliente: number;
  nome: string;
  cpf: string;
};

export type ClienteForm = {
  nome: string;
  cpf: string;
};

export type Pedido = {
  idVenda: number;
  idCliente: number;
  dataVenda: string;
  nomeCliente?: string;
};

export type PedidoItem = {
  idProduto: number;
  descricao: string;
  qtdProduto: number;
  precoUnit: number;
};

export type PedidoDetalhes = {
  pedido: Pedido;
  itens: PedidoItem[];
};
