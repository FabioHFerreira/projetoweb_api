import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Cadastro de Usuários",
      version: "1.0.0",
      description:
        "API desenvolvida para o projeto da disciplina de Programação Web, com cadastro e autenticação de usuários.",
    },
    servers: [
      {
        url: "https://yq9z3z-3333.csb.app",
        description: "Servidor de Desenvolvimento (CodeSandbox )",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT aqui",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-KEY",
          description: "Chave de API para acesso de administrador",
        },
      },
    },
  },
  apis: ["./src/server.ts"], // Diz ao Swagger para ler os comentários no arquivo do servidor
};

export const swaggerSpec = swaggerJsdoc(options);
