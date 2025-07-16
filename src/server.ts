import express, { type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swaggerConfig'
import { authMiddleware } from './middlewares/auth'

export const app = express()
const prisma = new PrismaClient()

app.use(express.json())

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relacionadas a usuários
 *
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Bruce Wayne"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "bruce@wayne.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "batman123"
 *               telefone:
 *                 type: string
 *                 example: "11987654321"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: E-mail já está em uso
 */
app.post('/users', async (request: Request, response: Response) => {
  try {
    // Desestruturando e tipando o corpo da requisição
    const { nome, email, senha, telefone } = request.body as {
      nome: string
      email: string
      senha: string
      telefone?: string
    }

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email }
    })

    // Checagem explícita
    if (userAlreadyExists !== null) {
      return response
        .status(400)
        .json({ error: 'Este e-mail já está em uso.' })
    }

    const hashedPassword = await bcrypt.hash(senha, 8)

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone
      }
    })

    const userWithoutPassword = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      telefone: user.telefone,
      createdAt: user.createdAt
    }

    return response.status(201).json(userWithoutPassword)
  } catch (error) {
    return response
      .status(500)
      .json({ error: 'Ocorreu um erro ao criar o usuário.' })
  }
})

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Processo de login e obtenção de token
 *
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "bruce@wayne.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "batman123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, token retornado
 *       401:
 *         description: E-mail ou senha inválidos
 */
app.post('/login', async (request: Request, response: Response) => {
  try {
    const { email, senha } = request.body as { email: string, senha: string }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Checagem explícita
    if (user === null) {
      return response.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha)

    if (!isPasswordValid) {
      return response.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    const jwtSecret = process.env.JWT_SECRET
    // Checagem explícita
    if (jwtSecret === null || jwtSecret === undefined || jwtSecret === '') {
      console.error('A variável de ambiente JWT_SECRET não está definida.')
      return response.status(500).json({ error: 'Erro interno do servidor.' })
    }

    const jwt = await import('jsonwebtoken')
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1d' })

    return response.json({ token })
  } catch (error) {
    return response
      .status(500)
      .json({ error: 'Ocorreu um erro ao fazer login.' })
  }
})

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retorna os dados do usuário atualmente autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Não autorizado (token inválido ou não fornecido)
 */
app.get('/me', authMiddleware, async (request: Request, response: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true
      }
    })

    // Checagem explícita
    if (user === null) {
      return response.status(404).json({ error: 'Usuário não encontrado.' })
    }

    return response.json(user)
  } catch (error) {
    return response
      .status(500)
      .json({ error: 'Ocorreu um erro ao buscar os dados.' })
  }
})

// ROTA DA DOCUMENTAÇÃO SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT ?? 3333

// Inicia o servidor apenas se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${Number(PORT)}`)
  })
}
