mport express from 'express';
import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs'; 

const app = express();
const prisma = new PrismaClient(); 
app.use(express.json());

app.post('/users', async (request, response) => {
  try {
    const { nome, email, senha, telefone } = request.body;

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      return response.status(400).json({ error: 'Este e-mail já está em uso.' });
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
    return response.status(500).json({ error: 'Ocorreu um erro ao criar o usuário.' });
  }
});


app.get('/', (request, response) => {
  return response.json({ message: 'API está funcionando!' });
});

const PORT = process.env.PORT || 3333; 
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
