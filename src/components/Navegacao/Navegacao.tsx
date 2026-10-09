import { type JSX } from 'react';
import { NavLink } from 'react-router-dom';

function Navegacao(): JSX.Element {
  return (
    <header className='topbar'>
      <div className='brand-block'>
        <div className='brand-mark'>F</div>
        <span className='brand-name'>Farmácia</span>
      </div>

      <nav className='nav-links' aria-label='Navegação principal'>
        <NavLink to='/' end>Home</NavLink>
        <NavLink to='/clientes'>Clientes</NavLink>
        <NavLink to='/produtos'>Produtos</NavLink>
        <NavLink to='/pedidos'>Pedidos</NavLink>
      </nav>

      <div className='user-box'>
        <span>Atendente</span>
      </div>
    </header>
  );
}

export default Navegacao;
