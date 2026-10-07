import { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import type { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';

interface CustomMenuItem extends MenuItem {
  badge?: number;
  shortcut?: string;
  items?: CustomMenuItem[];
}

function Navegacao(): JSX.Element {
  const navigate = useNavigate();

  const items: CustomMenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/'),
      className: 'm-5 text-white text-lg'
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      command: () => navigate('/clientes'),
      className: 'm-5 text-white text-lg'
    },
    {
      label: 'Produtos',
      icon: 'pi pi-shopping-cart',
      command: () => navigate('/produtos'),
      className: 'm-5 text-white text-lg'
    },
    {
      label: 'Pedidos',
      icon: 'pi pi-chart-bar',
      command: () => navigate('/pedidos'),
      className: 'm-5 text-white text-lg'
    }
  ];

  const start = (
    <div className='brand-block'>
      <div className='brand-mark'>F</div>
      <span className='brand-name'>Farmácia</span>
    </div>
  );

  const end = (
    <div className='user-box'>
      <span>Atendente</span>
      <Avatar
        label='A'
        shape='circle'
        style={{ backgroundColor: '#fff', color: '#334155', fontWeight: 700 }}
      />
    </div>
  );

  return (
    <header className='topbar'>
      <Menubar model={items} start={start} end={end} />
    </header>
  );
}

export default Navegacao;
