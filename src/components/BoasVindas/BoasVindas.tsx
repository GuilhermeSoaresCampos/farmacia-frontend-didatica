import type { Produto } from '../../types';

type Props = {
    produtos: Produto[];
    alertas: Produto[];
};

function BoasVindas({ produtos, alertas }: Props) {
    return (
        <main className="main-home">
            <h1>Farmácia Didática</h1>

            <p>
                Seja bem-vindo ao sistema da farmácia. Aqui você acompanha produtos em estoque,
                identifica alertas e mantém o controle de vendas de forma simples e organizada.
            </p>

            <div className="summary-grid">
                <div className="summary-box">
                    <div className="value">{produtos.length}</div>
                    <div className="label">Produtos</div>
                </div>
                <div className="summary-box">
                    <div className="value">{produtos.filter((p) => p.qtdEstoque > p.qtdMinEstoque).length}</div>
                    <div className="label">Em estoque</div>
                </div>
                <div className="summary-box warning">
                    <div className="value">{alertas.length}</div>
                    <div className="label">Em alerta</div>
                </div>
            </div>
        </main>
    );
}

export default BoasVindas;
