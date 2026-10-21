import type { Cliente, Pedido, PedidoDetalhes, Produto } from '../types';

const API_URL = (
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3333'
).trim().replace(/\/+$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(30000),
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });

    if (response.status === 204) {
      return null as T;
    }

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const message = typeof body === 'object' && body && 'mensagem' in body
        ? String((body as { mensagem?: string }).mensagem)
        : typeof body === 'string' && body.trim()
          ? body
          : response.statusText || 'Erro na requisição.';
      throw new Error(message);
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error('A API não respondeu em 30 segundos. Verifique se o backend está ativo.');
    }

    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar com o servidor da farmácia.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro na requisição.');
  }
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
