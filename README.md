# Sistema de Chamados — API REST

[![Testes da API](https://github.com/nathdrocha-dev/sistema-chamados-api/actions/workflows/tests.yml/badge.svg)](https://github.com/nathdrocha-dev/sistema-chamados-api/actions/workflows/tests.yml)

API REST para gerenciamento de chamados de suporte técnico, desenvolvida com **Node.js, Express e MySQL**.

> **Projeto de estudos.** Desenvolvido por [Seu nome], estudante de Técnico em Informática, para praticar desenvolvimento Back-end: API REST, arquitetura em camadas, banco de dados relacional e testes automatizados.

## Funcionalidades

- Cadastro, consulta por ID, listagem, atualização de status e exclusão de chamados.
- Filtros por status, categoria e prioridade.
- Paginação de resultados.
- Validação dos dados recebidos.
- Tratamento centralizado de erros.
- Testes unitários e de integração com banco de dados separado.
- Execução dos testes via GitHub Actions.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js | Ambiente de execução |
| Express 5 | Framework da API REST |
| MySQL + mysql2 | Banco de dados relacional e driver |
| dotenv | Variáveis de ambiente |
| Jest + Supertest | Testes unitários e de integração HTTP |

## Arquitetura

```
sistema-chamados-api/
├── .github/workflows/     # Pipeline de testes (GitHub Actions)
├── database/
│   ├── schema.sql         # Banco da aplicação
│   └── schema.test.sql    # Banco de testes
├── src/
│   ├── constants/         # Valores permitidos (categorias, prioridades, status)
│   ├── controllers/       # Recebem a requisição e montam a resposta HTTP
│   ├── errors/            # Erros personalizados
│   ├── middlewares/       # Tratamento global de erros
│   ├── routes/            # Definição dos endpoints
│   ├── services/          # Regras de negócio e consultas SQL
│   ├── validators/        # Validação e normalização dos dados
│   ├── app.js             # Configuração do Express
│   ├── database.js        # Pool de conexões MySQL
│   └── index.js           # Inicialização do servidor
├── tests/                 # Testes automatizados (Jest + Supertest)
├── .env.example
├── jest.config.js
└── package.json
```

Fluxo de uma requisição: **routes → controllers → validators/services → banco de dados**, com erros tratados por um middleware central.

## Como executar

### Pré-requisitos

- Node.js 18 ou superior (requisito do Express 5) e npm.
- MySQL instalado e em execução.

### 1. Clonar e instalar

```bash
git clone https://github.com/nathdrocha-dev/sistema-chamados-api.git
cd sistema-chamados-api
npm install
```

### 2. Criar o banco de dados

O script cria o banco `sistema_chamados` e a tabela `chamados`. Execute-o pelo MySQL Workbench (abra `database/schema.sql` e execute o script completo) ou pelo terminal:

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz, a partir de `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_chamados
```

> Os arquivos `.env` e `.env.test` contêm credenciais locais e não devem ser enviados ao GitHub.

### 4. Iniciar a API

```bash
npm start
```

O servidor sobe em `http://localhost:3000`. <!-- VERIFICAR: a porta é fixa no código ou aceita PORT no .env? -->

Teste rápido:

```bash
curl http://localhost:3000/chamados
```

Também é possível usar Postman, Insomnia ou outro cliente HTTP.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/chamados` | Lista chamados (com filtros e paginação) |
| GET | `/chamados/:id` | Busca um chamado por ID |
| POST | `/chamados` | Cria um chamado |
| PUT | `/chamados/:id` | Atualiza o status de um chamado |
| DELETE | `/chamados/:id` | Exclui um chamado |

### POST `/chamados`

```json
{
  "titulo": "Computador não liga",
  "descricao": "O computador não está inicializando",
  "solicitante": "Carlos",
  "categoria": "Hardware",
  "prioridade": "Alta"
}
```

O status inicial é `Aberto`. Retorna `201 Created`. <!-- VERIFICAR: campos obrigatórios, limites de tamanho e adicionar um exemplo do JSON retornado -->

### GET `/chamados`

Parâmetros de consulta opcionais:

| Parâmetro | Descrição |
|---|---|
| `status` | Filtra por status |
| `categoria` | Filtra por categoria |
| `prioridade` | Filtra por prioridade |
| `pagina` | Número da página (padrão: 1) |
| `limite` | Registros por página (padrão: 10, máximo: 100) |

```
GET /chamados?categoria=Hardware&prioridade=Alta&pagina=1&limite=5
```

A resposta traz os chamados encontrados e metadados de paginação: total de registros, total de páginas, página atual e limite. <!-- VERIFICAR: incluir um exemplo real da resposta JSON -->

### GET `/chamados/:id`

Retorna o chamado informado ou `404 Not Found` se ele não existir.

### PUT `/chamados/:id`

Atualiza apenas o status do chamado:

```json
{
  "status": "Em andamento"
}
```

### DELETE `/chamados/:id`

Remove o chamado informado. <!-- VERIFICAR: código de sucesso (200 ou 204) e retorno para ID inexistente -->

### Valores permitidos

| Campo | Valores |
|---|---|
| `categoria` | Hardware, Software, Rede, Acesso, Outro |
| `prioridade` | Baixa, Média, Alta |
| `status` | Aberto, Em andamento, Finalizado |

### Códigos HTTP

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Chamado criado |
| 400 | Dados ou parâmetros inválidos |
| 404 | Chamado não encontrado |
| 500 | Erro interno do servidor |

## Testes

Os testes usam Jest e Supertest e cobrem operações CRUD, integração com MySQL, validações, filtros, paginação, tratamento de erros e cenários de sucesso e falha.

Eles rodam em um banco separado, `sistema_chamados_test`, porque criam, atualizam e excluem registros. **Nunca aponte o `.env.test` para o banco principal.**

### Configurar o banco de testes

```bash
mysql -u root -p < database/schema.test.sql
```

Crie o arquivo `.env.test` na raiz:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_chamados_test
```

### Executar

```bash
npm test                    # executa os testes
npm test -- --coverage      # gera o relatório de cobertura
```

O relatório HTML fica em `coverage/lcov-report/index.html`.

### Cobertura de referência

| Métrica | Resultado |
|---|---:|
| Testes aprovados | 38 (7 suítes) |
| Linhas | 90,56% |
| Decisões | 87,20% |
| Funções | 100% |

Valores de uma execução local durante o desenvolvimento. Podem mudar conforme o código evolui; rode `npm test -- --coverage` para o resultado atual.

## Limitações conhecidas e próximos passos

Por ser um projeto de estudos, a API não possui:

- Autenticação e autorização de usuários.
- Edição dos demais campos do chamado (hoje o `PUT` altera só o status).
- Histórico de alterações dos chamados.
- Documentação interativa (OpenAPI/Swagger).
- Interface web e implantação em servidor.

Esses são os próximos itens que pretendo estudar e implementar.

## Autoria

**Nathan David** — estudante de Técnico em Informática
[LinkedIn](www.linkedin.com/in/nathan-david-77777n) · [GitHub](https://github.com/nathdrocha-dev)
