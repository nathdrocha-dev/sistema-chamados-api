# Sistema de Chamados — API REST

API REST para gerenciamento de chamados de suporte técnico, desenvolvida com **Node.js, Express e MySQL**.

O sistema permite cadastrar, consultar, atualizar e excluir chamados, além de oferecer filtros, paginação, validação de dados e tratamento centralizado de erros.

O projeto foi desenvolvido com foco no aprendizado e na aplicação prática de conceitos de desenvolvimento Back-end, arquitetura em camadas, bancos de dados relacionais e testes automatizados.

## Tecnologias utilizadas

- **Node.js** — Ambiente de execução JavaScript.
- **Express 5** — Framework para construção da API REST.
- **MySQL** — Banco de dados relacional.
- **MySQL2** — Integração entre Node.js e MySQL.
- **dotenv** — Gerenciamento de variáveis de ambiente.
- **Jest** — Framework de testes automatizados.
- **Supertest** — Testes de integração HTTP.

## Funcionalidades

- Cadastro de chamados.
- Consulta de chamados por ID.
- Listagem de chamados.
- Filtros por status, categoria e prioridade.
- Paginação de resultados.
- Atualização do status de chamados.
- Exclusão de chamados.
- Validação dos dados recebidos.
- Tratamento centralizado de erros.
- Testes unitários e de integração.

## Estrutura do projeto

```text
sistema-chamados/
├── database/
│   └── schema.sql
├── src/
│   ├── constants/
│   ├── controllers/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   ├── database.js
│   └── index.js
├── tests/
│   ├── chamados.crud.test.js
│   ├── chamados.filtros.test.js
│   ├── chamados.independentes.test.js
│   ├── chamados.test.js
│   ├── chamados.validator.test.js
│   ├── database.test.js
│   ├── errorHandler.test.js
│   ├── setup.js
│   └── teardown.js
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

### Organização da arquitetura

**Routes:** definição dos endpoints.

**Controllers:** recebimento das requisições e construção das respostas HTTP.

**Services:** operações de negócio e consultas SQL.

**Validators:** validação e normalização dos dados.

**Middlewares:** tratamento global de erros.

**Database:** configuração do pool de conexões MySQL.

## Requisitos

- Node.js e npm instalados.
- MySQL instalado e em execução.
- Um cliente MySQL, como MySQL Workbench, para executar o script de criação do banco.

## Instalação

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd sistema-chamados
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o banco de dados

O projeto utiliza MySQL para armazenar os chamados e possui dois bancos separados: um para a aplicação e outro para os testes automatizados.

### Banco principal

1. Inicie o servidor MySQL.
2. Abra o MySQL Workbench.
3. Abra o arquivo `database/schema.sql`.
4. Execute o script completo.

O script criará o banco `sistema_chamados` e a tabela `chamados`.

Na raiz do projeto, crie o arquivo `.env` utilizando `.env.example` como referência:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_chamados
```

Substitua os valores pelas configurações do seu ambiente.

### Banco de testes

Para executar os testes automatizados:

1. Abra o MySQL Workbench.
2. Abra o arquivo `database/schema.test.sql`.
3. Execute o script completo.
4. Confirme que o banco `sistema_chamados_test` foi criado.
5. Crie o arquivo `.env.test` na raiz do projeto:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_chamados_test
```

**Atenção:** utilize exclusivamente o banco `sistema_chamados_test` durante os testes. Os testes de integração criam, atualizam e excluem registros.

Os arquivos `.env` e `.env.test` contêm credenciais locais e não devem ser publicados no GitHub.

### Executando os testes

Para executar todos os testes:

```bash
npm test
```

Para executar os testes e gerar o relatório de cobertura:

```bash
npm test -- --coverage
```

O relatório HTML estará disponível em:

```text
coverage/lcov-report/index.html
```

Abra esse arquivo no navegador para visualizar as linhas e condições exercitadas pelos testes.

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando `.env.example` como referência:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_chamados
```

Não publique credenciais reais no repositório.

### 5. Iniciar a aplicação

Execute o comando:

```bash
npm start
```

O servidor será iniciado na porta **3000**.

A API ficará disponível em:

```text
http://localhost:3000
```

Para consultar os chamados:

```http
GET http://localhost:3000/chamados
```

As requisições podem ser realizadas utilizando Postman ou outro cliente HTTP.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/chamados` | Lista os chamados |
| GET | `/chamados/:id` | Busca um chamado por ID |
| POST | `/chamados` | Cria um novo chamado |
| PUT | `/chamados/:id` | Atualiza o status de um chamado |
| DELETE | `/chamados/:id` | Exclui um chamado |

### Criar chamado

**POST `/chamados`**

Corpo da requisição:

```json
{
  "titulo": "Computador não liga",
  "descricao": "O computador não está inicializando",
  "solicitante": "Carlos",
  "categoria": "Hardware",
  "prioridade": "Alta"
}
```

O status inicial do chamado é `Aberto`.

**Resposta esperada:** HTTP `201 Created`.

### Consultar chamado

**GET `/chamados/1`**

Retorna o chamado correspondente ao identificador informado.

Se o chamado não existir, a API retorna HTTP `404 Not Found`.

### Listar chamados

**GET `/chamados`**

A listagem permite utilizar parâmetros de consulta opcionais:

| Parâmetro | Descrição |
|---|---|
| `status` | Filtra pelo status |
| `categoria` | Filtra pela categoria |
| `prioridade` | Filtra pela prioridade |
| `pagina` | Número da página, padrão 1 |
| `limite` | Quantidade de registros por página, padrão 10 |

O limite máximo permitido é de 100 registros por página.

Exemplo:

```http
GET /chamados?categoria=Hardware&prioridade=Alta&pagina=1&limite=5
```

A resposta inclui os chamados encontrados e metadados de paginação, como total de registros, total de páginas, página atual e limite.

### Atualizar chamado

**PUT `/chamados/1`**

Corpo da requisição:

```json
{
  "status": "Em andamento"
}
```

### Excluir chamado

**DELETE `/chamados/1`**

Remove o chamado correspondente ao ID informado.

## Valores permitidos

**Categorias**

- Hardware
- Software
- Rede
- Acesso
- Outro

**Prioridades**

- Baixa
- Média
- Alta

**Status**

- Aberto
- Em andamento
- Finalizado

## Códigos HTTP

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Chamado criado |
| 400 | Dados ou parâmetros inválidos |
| 404 | Chamado não encontrado |
| 500 | Erro interno do servidor |

## Testes automatizados

O projeto utiliza Jest e Supertest para verificar as funcionalidades da API.

Os testes incluem:

- Operações CRUD.
- Integração com MySQL.
- Validações de dados.
- Filtros e paginação.
- Tratamento de erros.
- Cenários de sucesso e falha.

Os testes de integração utilizam o banco `sistema_chamados_test`, separado do banco principal.

Antes de executá-los, configure o arquivo `.env.test` e crie a estrutura necessária no banco de testes.

### Executar os testes

```bash
npm test
```

### Gerar relatório de cobertura

```bash
npm test -- --coverage
```

### Resultados obtidos durante o desenvolvimento

| Métrica | Resultado |
|---|---:|
| Testes aprovados | 38 |
| Suítes aprovadas | 7 |
| Cobertura de linhas | 90,56% |
| Cobertura de decisões | 87,20% |
| Cobertura de funções | 100% |

Esses resultados correspondem à execução de referência realizada durante o desenvolvimento.

## Melhorias futuras

- Autenticação e autorização de usuários.
- Histórico de alterações dos chamados.
- Interface web para gerenciamento.
- Documentação interativa com OpenAPI/Swagger.
- Implantação da aplicação em um servidor.

## Sobre o projeto

Projeto desenvolvido para aplicar conhecimentos de JavaScript, Node.js, Express, MySQL, arquitetura de APIs REST e testes automatizados.

Seu objetivo é demonstrar a construção de uma aplicação Back-end organizada, testável e integrada a um banco de dados relacional.
