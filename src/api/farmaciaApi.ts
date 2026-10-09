import type { Cliente, Pedido, PedidoDetalhes, Produto } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const body = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = typeof body === 'object' && body && 'mensagem' in body ? String((body as { mensagem?: string }).mensagem) : 'Erro na requisição.';
    throw new Error(message);
  }

  return body as T;
}

export const api = {
  listarClientes: () => request<Cliente[]>('/clientes'),
  cadastrarCliente: (cliente: Pick<Cliente, 'nome' | 'cpf'>) =>
    request<{ idCliente: number; mensagem: string }>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente)
    }),
  listarProdutos: () => request<Produto[]>('/produtos'),
  cadastrarProduto: (produto: Omit<Produto, 'idProduto' | 'emAlerta'>) =>
    request<{ idProduto: number; mensagem: string }>('/produtos', {
      method: 'POST',
      body: JSON.stringify(produto)
    }),
  atualizarProduto: (idProduto: number, produto: Partial<Omit<Produto, 'idProduto' | 'emAlerta'>>) =>
    request<{ mensagem: string }>(`/produtos/${idProduto}`, {
      method: 'PUT',
      body: JSON.stringify(produto)
    }),
  listarProdutosAlerta: () => request<Produto[]>('/produtos/alerta'),
  listarPedidos: () => request<Pedido[]>('/pedidos'),
  obterPedido: (idVenda: number) => request<PedidoDetalhes>(`/pedidos/${idVenda}`),
  criarPedido: (pedido: { idCliente: number; itens: Array<{ idProduto: number; qtdProduto: number; precoUnit: number }> }) =>
    request<{ idVenda: number; mensagem: string; totalItens: number }>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido)
    })
};
