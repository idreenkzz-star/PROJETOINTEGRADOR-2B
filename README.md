# Projeto Integrador - 2 B

Aplicativo mobile desenvolvido com **Expo + React Native + TypeScript** para simular o fluxo de um restaurante com três áreas principais:

- **Cardápio do cliente**
- **Gestão do restaurante**
- **Controle de pedidos e mesas**
- **Agendamento de mesas**
- **Histórico de pedidos**

O projeto foi pensado para organizar o atendimento de forma simples e visual, permitindo cadastrar pratos, montar pedidos, acompanhar o status de preparo, monitorar as mesas do salão, reservar mesas com antecedência e consultar o histórico de pedidos realizados.

## Visão Geral

Ao abrir o aplicativo, o usuário é direcionado para a área de gerenciamento do restaurante. A navegação principal é organizada em abas e o estado das telas é compartilhado por meio de contextos globais.

O sistema mantém os dados de cardápio e pedidos em armazenamento local, enquanto o painel de mesas acompanha o status operacional em tempo real dentro da sessão do app.

## Funcionalidades

### Cliente

- Visualização do cardápio por categoria
- Exibição de imagem, nome, descrição e preço dos itens
- Adição de produtos ao carrinho
- Ajuste de quantidade no carrinho
- Seleção de mesa disponível para o pedido
- Informações do cliente e quantidade de pessoas
- Envio do pedido para o restaurante

### Restaurante

- Listagem completa dos itens do cardápio
- Cadastro de novos pratos
- Edição de pratos existentes
- Remoção de itens com confirmação
- Visualização do detalhe de cada item
- Sincronização automática do status das mesas com o andamento dos pedidos

### Pedidos

- Listagem dos pedidos realizados
- Exibição de cliente, horário, itens e total
- Controle de status do pedido:
  - `pending`
  - `preparing`
  - `ready`
  - `delivered`

### Histórico de Pedidos

- Consulta dos pedidos realizados de forma read-only
- Filtro por status (todos, pendente, preparando, pronto, entregue)
- Exibição de cliente, data/hora, itens e total
- Modal com detalhes completos do pedido

### Mesas

- Painel visual com 12 mesas padrão
- Adição e remoção de mesas
- Edição de status da mesa:
  - `vaga`
  - `aguardando`
  - `preparando`
  - `pronto`
  - `atendido`
- Associação da mesa ao cliente e ao pedido
- Visualização do pedido atual e da quantidade de pessoas

### Agendamento de Mesa

- Seletor de mesa disponível para a reserva
- Informações do cliente, data, horário e quantidade de pessoas
- Validação de data (`AAAA-MM-DD`) e horário (`HH:MM`)
- Lista das próximas reservas ordenadas por data e hora
- Cancelamento de reserva com confirmação

## Tecnologias

- **Expo**
- **React Native**
- **TypeScript**
- **Expo Router**
- **AsyncStorage**
- **Supabase JS** como dependência do projeto
- **Jest** para testes
- **Lucide Icons**

## Estrutura do Projeto

```text
app/
  (tabs)/
    client/
    order/
      historico.tsx
    restaurant/
    mesas/
      agendar.tsx
contexts/
  MenuContext.tsx
  MesaContext.tsx
  ReservaContext.tsx
hooks/
types/
  reservas.ts
assets/
__tests__/
```

### Principais arquivos

- [`app/_layout.tsx`](./app/_layout.tsx): layout raiz com os providers globais
- [`app/index.tsx`](./app/index.tsx): redirecionamento inicial para o fluxo principal
- [`contexts/MenuContext.tsx`](./contexts/MenuContext.tsx): estado global de cardápio e pedidos
- [`contexts/MesaContext.tsx`](./contexts/MesaContext.tsx): estado global das mesas
- [`contexts/ReservaContext.tsx`](./contexts/ReservaContext.tsx): estado global das reservas de mesa
- [`app/(tabs)/client/index.tsx`](./app/%28tabs%29/client/index.tsx): tela do cardápio do cliente
- [`app/(tabs)/client/cart.tsx`](./app/%28tabs%29/client/cart.tsx): carrinho e envio de pedido
- [`app/(tabs)/restaurant/index.tsx`](./app/%28tabs%29/restaurant/index.tsx): gestão do cardápio
- [`app/(tabs)/restaurant/add-item.tsx`](./app/%28tabs%29/restaurant/add-item.tsx): cadastro de pratos
- [`app/(tabs)/restaurant/editar-item.tsx`](./app/%28tabs%29/restaurant/editar-item.tsx): edição de pratos
- [`app/(tabs)/order/index.tsx`](./app/%28tabs%29/order/index.tsx): acompanhamento dos pedidos
- [`app/(tabs)/order/historico.tsx`](./app/%28tabs%29/order/historico.tsx): histórico de pedidos realizados
- [`app/(tabs)/mesas/index.tsx`](./app/%28tabs%29/mesas/index.tsx): painel de mesas
- [`app/(tabs)/mesas/agendar.tsx`](./app/%28tabs%29/mesas/agendar.tsx): agendamento de mesas

## Como Executar

### Pré-requisitos

- Node.js instalado
- Gerenciador de pacotes `npm`
- Expo Go ou emulador/simulador configurado

### Instalação

```bash
npm install
```

### Rodar o app

```bash
npm run dev
```

### Web

```bash
npm run build:web
```

## Scripts Disponíveis

- `npm run dev` - inicia o Expo
- `npm run build:web` - exporta a versão web
- `npm run lint` - executa o lint
- `npm run typecheck` - valida os tipos do TypeScript
- `npm run test` - executa os testes
- `npm run test:watch` - executa os testes em modo observação

## Persistência de Dados

O projeto usa:

- `AsyncStorage` para salvar `menuItems`, `orders` e `reservas`
- estado em memória para o gerenciamento das mesas

Isso permite que o cardápio, os pedidos e as reservas permaneçam salvos entre reinicializações do app, enquanto o painel de mesas funciona de forma integrada durante a execução.

## Testes

O repositório inclui testes para funções auxiliares de:

- cálculo do total de pedidos
- criação de pedidos
- criação das mesas padrão
- atualização de status das mesas
- criação de reservas de mesa
- validação de data e horário de reserva

Execute com:

```bash
npm run test
```

## Versionamento

O projeto utiliza a branch `main` como branch principal do repositório.

### Branches criadas/ utilizadas

- `main` - branch principal e padrão do projeto
- `PI-IV-IniciandoPROJETO` - branch de início da implementação
- `feature/Carlos` - branch de desenvolvimento de funcionalidades
- `feature/TestesUnitariosImplementados` - branch para a implementação dos testes unitários
- `projetoVA_main` - branch auxiliar utilizada durante o desenvolvimento

Esse fluxo ajuda a separar etapas do trabalho, organizar entregas e manter o histórico do projeto mais claro.

## Identidade Visual

O app utiliza uma paleta quente, com destaque para o laranja `#FF6B35`, reforçando a proposta de um sistema de restaurante moderno e direto.

## Licença

Este projeto foi desenvolvido para fins acadêmicos no contexto de um projeto integrador.
