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
2. Configure a URL pública da API em `.env`:
   `VITE_SERVER_URL=https://sua-api.example.com`
3. Execute o frontend (reinicie o servidor após alterar o `.env`):
   npm run dev

## API
O frontend usa `VITE_SERVER_URL` para acessar a API. `VITE_API_URL` também é aceito para manter compatibilidade com configurações existentes. Se nenhuma variável estiver definida, usa `http://localhost:3333`.
