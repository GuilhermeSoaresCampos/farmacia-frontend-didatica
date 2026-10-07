import { useEffect, useState } from 'react';
import { api } from '../../api/farmaciaApi';
import Navegacao from '../../components/Navegacao/Navegacao';
import Rodape from '../../components/Rodape/Rodape';
import type { Produto, ProdutoForm } from '../../types';

const produtoInicial: ProdutoForm = {
  descricao: '',
  validade: '',
  preco: 0,
  qtdEstoque: 0,
  qtdMinEstoque: 0
};

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [alertas, setAlertas] = useState<Produto[]>([]);
  const [termoBusca, setTermmoBusca] = useState('');
  const [form, setForm] = useState<ProdutoForm>(produtoInicial);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const carregarDados = async () => {
    try {
      const [listaProdutos, listaAlertas] = await Promise.all([
        api.listarProdutos(),
        api.listarProdutosAlerta()
      ]);

      setProdutos(listaProdutos);
      setAlertas(listaAlertas);
    } catch (error) {
      console.error('Erro ao buscar dados de produtos:', error);
      setFeedback({
        type: 'error',
        text: 'Não foi possível carregar a lista de produtos.'
      });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.descricao.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...form,
      validade: form.validade || null,
      qtdEstoque: Number(form.qtdEstoque),
      qtdMinEstoque: Number(form.qtdMinEstoque),
      preco: Number(form.preco)
    };

    try {
      if (editandoId !== null) {
        await api.atualizarProduto(editandoId, payload);
        setFeedback({ type: 'success', text: 'Produto atualizado com sucesso.' });
      } else {
        await api.cadastrarProduto(payload);
        setFeedback({ type: 'success', text: 'Produto cadastrado com sucesso.' });
      }

      setForm(produtoInicial);
      setEditandoId(null);
      await carregarDados();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao salvar produto.';
      setFeedback({ type: 'error', text: mensagem });
    }
  };

  const handleEditar = (produto: Produto) => {
    setEditandoId(produto.idProduto);
    setForm({
      descricao: produto.descricao,
      validade: produto.validade ? new Date(produto.validade).toISOString().slice(0, 10) : '',
      preco: produto.preco,
      qtdEstoque: produto.qtdEstoque,
      qtdMinEstoque: produto.qtdMinEstoque
    });
    setFeedback(null);
  };

  return (
    <>
      <Navegacao />

      <main className='page-shell produto-page'>
        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Cadastro de produtos</span>
              <h2>Gestão do estoque</h2>
            </div>
            <button type='button' className='secondary-btn inline-btn' onClick={() => { setEditandoId(null); setForm(produtoInicial); }}>
              Novo produto
            </button>
          </div>

          {feedback && (
            <div className={feedback.type === 'success' ? 'status-box success' : 'status-box error'}>
              {feedback.text}
            </div>
          )}

          <form className='produto-form' onSubmit={handleSubmit}>
            <div className='form-grid'>
              <label>
                Descrição
                <input
                  type='text'
                  value={form.descricao}
                  onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                  required
                />
              </label>

              <label>
                Preço
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={form.preco}
                  onChange={(event) => setForm({ ...form, preco: Number(event.target.value) })}
                  required
                />
              </label>

              <label>
                Estoque atual
                <input
                  type='number'
                  min='0'
                  value={form.qtdEstoque}
                  onChange={(event) => setForm({ ...form, qtdEstoque: Number(event.target.value) })}
                  required
                />
              </label>

              <label>
                Estoque mínimo
                <input
                  type='number'
                  min='0'
                  value={form.qtdMinEstoque}
                  onChange={(event) => setForm({ ...form, qtdMinEstoque: Number(event.target.value) })}
                  required
                />
              </label>

              <label>
                Validade
                <input
                  type='date'
                  value={form.validade}
                  onChange={(event) => setForm({ ...form, validade: event.target.value })}
                />
              </label>
            </div>

            <div className='form-actions'>
              <button type='submit' className='primary-btn'>
                {editandoId !== null ? 'Atualizar produto' : 'Salvar produto'}
              </button>
            </div>
          </form>
        </section>

        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Lista</span>
              <h2>Produtos cadastrados</h2>
            </div>

            <input
              type='text'
              placeholder='Buscar produto...'
              className='buscar-input'
              value={termoBusca}
              onChange={(event) => setTermmoBusca(event.target.value)}
            />
          </div>

          <div className='alert-summary'>
            {alertas.length > 0 ? (
              <span className='pill alert'>{alertas.length} produtos em alerta</span>
            ) : (
              <span className='pill ok'>Sem alertas</span>
            )}
          </div>

          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                  <th>Preço</th>
                  <th>Validade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <p className='empty-state'>Nenhum produto encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <tr key={produto.idProduto}>
                      <td>{produto.idProduto}</td>
                      <td>{produto.descricao}</td>
                      <td>{produto.qtdEstoque}</td>
                      <td>{produto.qtdMinEstoque}</td>
                      <td>R$ {Number(produto.preco).toFixed(2)}</td>
                      <td>{produto.validade ? new Date(produto.validade).toLocaleDateString('pt-BR') : '—'}</td>
                      <td>
                        <span className={produto.emAlerta ? 'pill alert' : 'pill ok'}>
                          {produto.emAlerta ? 'Alerta' : 'OK'}
                        </span>
                      </td>
                      <td>
                        <button type='button' className='link-action' onClick={() => handleEditar(produto)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}

export default ProdutosPage;
