import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PHome from './pages/PHome/PHome'
import ClientesPage from './pages/ClientesPage/ClientesPage'
import ProdutosPage from './pages/ProdutosPage/ProdutosPage'
import PedidosPage from './pages/PedidosPage/PedidosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PHome />} />
        <Route path='/clientes' element={<ClientesPage />} />
        <Route path='/produtos' element={<ProdutosPage />} />
        <Route path='/pedidos' element={<PedidosPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
