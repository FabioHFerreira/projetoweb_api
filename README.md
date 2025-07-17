# Projeto de API - Análise e Desenvolvimento de Sistemas

## 1. Visão Geral

Este projeto consiste no desenvolvimento de uma API RESTful como parte da avaliação da disciplina de Programação Web. A aplicação foi construída em Node.js com TypeScript e implementa um sistema de cadastro e autenticação de usuários, seguindo as melhores práticas de desenvolvimento de software.

O objetivo principal foi atender a todos os requisitos técnicos obrigatórios, incluindo o uso de um ORM para interação com o banco de dados, autenticação de rotas via JWT, documentação interativa com Swagger, testes automatizados e a implantação da aplicação em um ambiente de nuvem.

---

## 2. Funcionalidades

A API possui os seguintes endpoints:

- `POST /users`: Cria um novo usuário no sistema.
- `POST /login`: Autentica um usuário existente e retorna um token de acesso (JWT).
- `GET /me`: Rota protegida que retorna as informações do usuário autenticado.
- `GET /api-docs`: Apresenta a documentação interativa da API via Swagger.

---

## 3. Links de Acesso

- **API Online no Render:** `https://projetoweb-api.onrender.com`
- **Documentação Interativa (Swagger ):** `https://projetoweb-api.onrender.com/api-docs`

---

## 4. Tecnologias Utilizadas

A construção deste projeto envolveu as seguintes tecnologias e ferramentas:

- **Backend:**

  - **Node.js:** Ambiente de execução JavaScript.
  - **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
  - **Express.js:** Framework para a construção do servidor e das rotas da API.

- **Banco de Dados e ORM:**

  - **PostgreSQL:** Banco de dados relacional.
  - **Prisma:** ORM (Object-Relational Mapper) de última geração para a interação com o banco de dados.

- **Autenticação:**

  - **JSON Web Tokens (JWT):** Para a criação de tokens de sessão e proteção de rotas.
  - **bcrypt.js:** Para a criptografia de senhas (hashing).

- **Testes e Qualidade de Código:**

  - **Jest:** Framework para a escrita de testes automatizados.
  - **Supertest:** Biblioteca para testar endpoints HTTP.
  - **ESLint:** Ferramenta de linting para garantir a consistência e a qualidade do código.

- **Documentação:**

  - **Swagger (OpenAPI):** Para a documentação automática e interativa da API.

- **Ambiente e Deploy:**
  - **CodeSandbox:** Ambiente de desenvolvimento em nuvem (Cloud IDE).
  - **Render:** Plataforma de nuvem para o deploy da API e do banco de dados PostgreSQL.
  - **GitHub:** Para o controle de versão do código.

---

## 5. Como Executar Localmente

Para executar o projeto em um ambiente local, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/FabioHFerreira/projetoweb_api.git
    cd projetoweb_api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    - Crie um arquivo `.env` na raiz do projeto.
    - Adicione as seguintes variáveis, substituindo pelos seus valores:
      ```
      DATABASE_URL="sua_url_de_conexao_com_o_postgresql"
      JWT_SECRET="sua_frase_secreta_para_o_jwt"
      ```

4.  **Execute as migrações do banco de dados:**

    ```bash
    npx prisma migrate deploy
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O servidor estará disponível em `http://localhost:3333`.
