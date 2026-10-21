import { useEffect, useState } from 'react';
import { api } from '../../api/farmaciaApi';
import BoasVindas from '../../components/BoasVindas/BoasVindas';
import Navegacao from '../../components/Navegacao/Navegacao';
import Rodape from '../../components/Rodape/Rodape';

function PHome() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarResumo = async () => {
      try {
        const [lista, listaAlerta] = await Promise.all([
          api.listarProdutos(),
          api.listarProdutosAlerta()
        ]);

        setProdutos(lista);
        setAlertas(listaAlerta);
      } catch (error) {
        console.error('Erro ao carregar resumo da farmácia:', error);
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao carregar os produtos.';
        setErro(`${mensagem} Confira se a API está ativa e se o CORS permite o endereço do front-end.`);
      } finally {
        setCarregando(false);
      }
    };

    carregarResumo();
  }, []);

  return (
    <>
      <Navegacao />
      <BoasVindas produtos={produtos} alertas={alertas} />

      <section className="card-lista">
        <div className="lista-header">
          <h2>Produtos em estoque</h2>
        </div>

        {erro && <div className="status-box error">{erro}</div>}

        {carregando ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : erro ? null : produtos.length === 0 ? (
          <p className="empty-state">Nenhum produto cadastrado.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                  <th>Preço</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.idProduto}>
                    <td>{produto.descricao}</td>
                    <td>{produto.qtdEstoque}</td>
                    <td>{produto.qtdMinEstoque}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>
                      <span className={produto.emAlerta ? 'pill alert' : 'pill ok'}>
                        {produto.emAlerta ? 'Alerta' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Rodape />
    </>
  );
}

export default PHome;
