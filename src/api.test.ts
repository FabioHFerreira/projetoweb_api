// src/api.test.ts (VERSÃO COMPLETA)
import request from "supertest";
import { app } from "./server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testUser = {
  nome: "Test User",
  email: "test.user@example.com",
  senha: "password123",
  telefone: "1234567890",
};

// Limpa o banco antes e depois dos testes para garantir um ambiente limpo
beforeEach(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe("Fluxo de Usuário e Autenticação", () => {
  // Teste 1: Criação de usuário
  it("deve ser capaz de criar um novo usuário", async () => {
    const response = await request(app).post("/users").send(testUser);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(testUser.email);
  });

  // Teste 2: Login com sucesso
  it("deve ser capaz de autenticar um usuário existente e retornar um token", async () => {
    // Primeiro, cria o usuário para poder testar o login
    await request(app).post("/users").send(testUser);

    // Agora, testa o login
    const response = await request(app)
      .post("/login")
      .send({ email: testUser.email, senha: testUser.senha });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token"); // Verifica se a resposta contém um token
  });

  // Teste 3: Acesso a rota protegida com token válido
  it("deve permitir acesso à rota /me com um token válido", async () => {
    await request(app).post("/users").send(testUser);
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: testUser.email, senha: testUser.senha });

    const token = loginResponse.body.token;

    const meResponse = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`); // Usa o token no header

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe(testUser.email);
  });

  // Teste 4: Bloqueio de rota protegida sem token
  it("não deve permitir acesso à rota /me sem um token", async () => {
    const response = await request(app).get("/me");
    expect(response.status).toBe(401);
  });
});
