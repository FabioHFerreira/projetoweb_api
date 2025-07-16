import request from 'supertest'
import { app } from './server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } })
  await prisma.$disconnect()
})

describe('API de Usuários', () => {
  // Teste 1: Deve ser capaz de criar um novo usuário
  it('deve ser capaz de criar um novo usuário', async () => {
    const response = await request(app).post('/users').send({
      nome: 'Test User',
      email: 'test.user@example.com',
      senha: 'password123',
      telefone: '1234567890'
    })

    // Verifica se a resposta foi 201 (Criado)
    expect(response.status).toBe(201)
    // Verifica se o email no corpo da resposta é o que enviamos
    expect(response.body.email).toBe('test.user@example.com')
    // Verifica se a resposta NÃO contém a senha
    expect(response.body).not.toHaveProperty('senha')
  })

  // Teste 2: Não deve ser capaz de criar um usuário com um e-mail que já existe
  it('não deve ser capaz de criar um usuário com um e-mail que já existe', async () => {
    // Tenta criar o mesmo usuário novamente
    const response = await request(app).post('/users').send({
      nome: 'Test User 2',
      email: 'test.user@example.com', // Mesmo e-mail
      senha: 'password123'
    })

    // Verifica se a resposta foi 400 (Bad Request)
    expect(response.status).toBe(400)
    // Verifica se a mensagem de erro está correta
    expect(response.body.error).toBe('Este e-mail já está em uso.')
  })
})
