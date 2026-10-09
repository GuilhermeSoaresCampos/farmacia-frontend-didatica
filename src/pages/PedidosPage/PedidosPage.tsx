import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/farmaciaApi';
import Navegacao from '../../components/Navegacao/Navegacao';
import Rodape from '../../components/Rodape/Rodape';

function PedidosPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [detalhesPedido, setDetalhesPedido] = useState<any>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState<Array<{ idProduto: number; descricao: string; qtdProduto: number; precoUnit: number }>>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const carregarDados = async () => {
    try {
      const [clientesDados, produtosDados, pedidosDados] = await Promise.all([
        api.listarClientes(),
        api.listarProdutos(),
        api.listarPedidos()
      ]);

      setClientes(clientesDados);
      setProdutos(produtosDados);
      setPedidos(pedidosDados);
    } catch (error) {
      console.error('Erro ao carregar reservas de pedidos:', error);
      setFeedback({ type: 'error', text: 'Não foi possível carregar pedidos e clientes.' });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const totalPedido = useMemo(
    () => itens.reduce((soma, item) => soma + item.qtdProduto * item.precoUnit, 0),
    [itens]
  );

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      setFeedback({ type: 'error', text: 'Selecione um produto antes de adicionar.' });
      return;
    }

    const produto = produtos.find((item) => item.idProduto === Number(produtoSelecionado));

    if (!produto) {
      setFeedback({ type: 'error', text: 'Produto não encontrado.' });
      return;
    }

    setFeedback(null);
    setItens((atual) => {
      const existente = atual.find((item) => item.idProduto === produto.idProduto);

      if (existente) {
        return atual.map((item) =>
          item.idProduto === produto.idProduto
            ? { ...item, qtdProduto: item.qtdProduto + quantidade }
            : item
        );
      }

      return [
        ...atual,
        {
          idProduto: produto.idProduto,
          descricao: produto.descricao,
          qtdProduto: quantidade,
          precoUnit: Number(produto.preco)
        }
      ];
    });

    setProdutoSelecionado('');
    setQuantidade(1);
  };

  const limparPedido = () => {
    setItens([]);
    setClienteSelecionado('');
    setProdutoSelecionado('');
    setDetalhesPedido(null);
  };

  const handleCriarPedido = async () => {
    if (!clienteSelecionado || itens.length === 0) {
      setFeedback({ type: 'error', text: 'Selecione um cliente e adicione ao menos um item.' });
      return;
    }

    try {
      await api.criarPedido({
        idCliente: Number(clienteSelecionado),
        itens: itens.map((item) => ({
          idProduto: item.idProduto,
          qtdProduto: item.qtdProduto,
          precoUnit: item.precoUnit
        }))
      });

      setFeedback({ type: 'success', text: 'Pedido criado com sucesso.' });
      limparPedido();
      await carregarDados();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao criar pedido.';
      setFeedback({ type: 'error', text: mensagem });
    }
  };

  const carregarDetalhes = async (pedido: any) => {
    try {
      const dados = await api.obterPedido(pedido.idVenda);
      setDetalhesPedido(dados);
    } catch (error) {
      console.error('Erro ao carregar pedido detalhado:', error);
      setFeedback({ type: 'error', text: 'Não foi possível carregar o detalhe do pedido.' });
    }
  };

  return (
    <>
      <Navegacao />

      <main className='page-shell produto-page'>
        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Pedidos</span>
              <h2>Cadastro de venda</h2>
            </div>
          </div>

          {feedback && (
            <div className={feedback.type === 'success' ? 'status-box success' : 'status-box error'}>
              {feedback.text}
            </div>
          )}

          <div className='pedido-layout'>
            <div className='pedido-form'>
              <label>
                Cliente
                <select value={clienteSelecionado} onChange={(event) => setClienteSelecionado(event.target.value)}>
                  <option value=''>Selecione o cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </label>

              <div className='item-selector'>
                <label>
                  Produto
                  <select value={produtoSelecionado} onChange={(event) => setProdutoSelecionado(event.target.value)}>
                    <option value=''>Selecione o produto</option>
                    {produtos.map((produto) => (
                      <option key={produto.idProduto} value={produto.idProduto}>
                        {produto.descricao}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Quantidade
                  <input
                    type='number'
                    min='1'
                    value={quantidade}
                    onChange={(event) => setQuantidade(Math.max(1, Number(event.target.value) || 1))}
                  />
                </label>

                <button type='button' className='secondary-btn' onClick={adicionarItem}>
                  Adicionar item
                </button>
              </div>
            </div>

            <aside className='pedido-resumo'>
              <h3>Resumo do pedido</h3>

              {itens.length === 0 ? (
                <p className='empty-state'>Nenhum item adicionado.</p>
              ) : (
                <ul className='resumo-itens'>
                  {itens.map((item) => (
                    <li key={item.idProduto}>
                      <span>
                        {item.descricao} x {item.qtdProduto}
                      </span>
                      <strong>R$ {(item.qtdProduto * item.precoUnit).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              )}

              <div className='total-box'>
                <span>Total</span>
                <strong>R$ {totalPedido.toFixed(2)}</strong>
              </div>

              <button type='button' className='primary-btn full-width' onClick={handleCriarPedido}>
                Salvar pedido
              </button>
            </aside>
          </div>
        </section>

        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Histórico</span>
              <h2>Pedidos cadastrados</h2>
            </div>
          </div>

          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <p className='empty-state'>Não há pedidos cadastrados.</p>
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => (
                    <tr key={pedido.idVenda}>
                      <td>{pedido.idVenda}</td>
                      <td>{pedido.nomeCliente ?? `Cliente ${pedido.idCliente}`}</td>
                      <td>{new Date(pedido.dataVenda).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button type='button' className='link-action' onClick={() => carregarDetalhes(pedido)}>
                          Ver itens
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {detalhesPedido && (
          <section className='card-surface painel-section'>
            <div className='section-header'>
              <div>
                <span className='eyebrow'>Detalhes do pedido</span>
                <h2>Pedido #{detalhesPedido.pedido.idVenda}</h2>
              </div>
            </div>

            <div className='table-wrap'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhesPedido.itens.map((item: any) => (
                    <tr key={`${detalhesPedido.pedido.idVenda}-${item.idProduto}`}>
                      <td>{item.descricao}</td>
                      <td>{item.qtdProduto}</td>
                      <td>R$ {Number(item.precoUnit).toFixed(2)}</td>
                      <td>R$ {(item.qtdProduto * item.precoUnit).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <Rodape />
    </>
  );
}

export default PedidosPage;
