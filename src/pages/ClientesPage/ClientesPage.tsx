import { useEffect, useState } from 'react';
import { api } from '../../api/farmaciaApi';
import Navegacao from '../../components/Navegacao/Navegacao';
import Rodape from '../../components/Rodape/Rodape';

const clienteInicial = {
  nome: '',
  cpf: ''
};

function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [form, setForm] = useState<any>(clienteInicial);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const carregarDados = async () => {
    try {
      const dados = await api.listarClientes();
      setClientes(dados);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      setFeedback({ type: 'error', text: 'Não foi possível carregar os clientes.' });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cpf = form.cpf.replace(/\D/g, '');
    if (!form.nome.trim() || cpf.length !== 11) {
      setFeedback({ type: 'error', text: 'Informe um nome e um CPF válido com 11 dígitos.' });
      return;
    }

    try {
      await (api as any).cadastrarCliente({ nome: form.nome.trim(), cpf });
      setFeedback({ type: 'success', text: 'Cliente cadastrado com sucesso.' });
      setForm(clienteInicial);
      await carregarDados();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao cadastrar cliente.';
      setFeedback({ type: 'error', text: mensagem });
    }
  };

  return (
    <>
      <Navegacao />

      <main className='page-shell produto-page'>
        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Cadastro</span>
              <h2>Clientes</h2>
            </div>
          </div>

          {feedback && (
            <div className={feedback.type === 'success' ? 'status-box success' : 'status-box error'}>
              {feedback.text}
            </div>
          )}

          <form className='produto-form' onSubmit={handleSubmit}>
            <div className='form-grid'>
              <label>
                Nome
                <input
                  type='text'
                  value={form.nome}
                  onChange={(event) => setForm({ ...form, nome: event.target.value })}
                  placeholder='Ex: Maria Silva'
                  required
                />
              </label>

              <label>
                CPF
                <input
                  type='text'
                  value={form.cpf}
                  onChange={(event) => setForm({ ...form, cpf: event.target.value })}
                  placeholder='Somente números'
                  maxLength={11}
                  required
                />
              </label>
            </div>

            <div className='form-actions'>
              <button type='submit' className='primary-btn'>Salvar cliente</button>
            </div>
          </form>
        </section>

        <section className='card-surface painel-section'>
          <div className='section-header'>
            <div>
              <span className='eyebrow'>Lista</span>
              <h2>Clientes cadastrados</h2>
            </div>
          </div>

          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <p className='empty-state'>Nenhum cliente encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
                    <tr key={cliente.idCliente}>
                      <td>{cliente.idCliente}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.cpf}</td>
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

export default ClientesPage;
