import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authMiddleware } from "./middlewares/auth";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post("/users", async (request, response) => {
  try {
    const { nome, email, senha, telefone } = request.body;

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      return response
        .status(400)
        .json({ error: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(senha, 8);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone,
      },
    });

    const userWithoutPassword = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      telefone: user.telefone,
      createdAt: user.createdAt,
    };

    return response.status(201).json(userWithoutPassword);
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Ocorreu um erro ao criar o usuário." });
  }
});
app.post("/login", async (request, response) => {
  try {
    const { email, senha } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return response.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return response.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    // Importante: Crie uma variável de ambiente para o segredo do JWT
    // Vá em "DevTools" -> "Configure Environment Variables" e adicione a chave JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("A variável de ambiente JWT_SECRET não está definida.");
      return response.status(500).json({ error: "Erro interno do servidor." });
    }

    const jwt = await import("jsonwebtoken");
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1d" });

    return response.json({ token });
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Ocorreu um erro ao fazer login." });
  }
});

// ROTA PROTEGIDA PARA BUSCAR DADOS DO USUÁRIO LOGADO
app.get("/me", authMiddleware, async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true,
      },
    });

    if (!user) {
      return response.status(404).json({ error: "Usuário não encontrado." });
    }

    return response.json(user);
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Ocorreu um erro ao buscar os dados." });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
