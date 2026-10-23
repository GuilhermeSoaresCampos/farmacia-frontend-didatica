# Farmácia Didática - Frontend

Frontend em React + Vite para consumir a API do backend da farmácia.

## Funcionalidades
- Dashboard inicial com resumo da farmácia
- Cadastro e atualização de produtos
- Busca por produtos
- Listagem de pedidos
- Criação de pedido com cliente e itens
- Detalhamento de pedido

## Execução
1. Instale as dependências:
   npm install
2. Inicie o backend em `farmacia-backend-didatica`
3. Execute o frontend:
   npm run dev

## API
O projeto utiliza a URL configurada em `.env.local` / `.env`:
VITE_API_URL=https://farmacia-backend-didatica-of2c.onrender.com

Crie o exemplo em `.env.example` e, localmente, copie para `.env.local` (ou `.env`) antes de iniciar o projeto.
