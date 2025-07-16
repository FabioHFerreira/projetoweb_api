import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
}

export function authMiddleware (
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const { authorization } = req.headers

  if (
    authorization === null ||
    authorization === undefined ||
    authorization === ''
  ) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  const [, token] = authorization.split(' ')

  try {
    const jwtSecret = process.env.JWT_SECRET

    if (jwtSecret === null || jwtSecret === undefined || jwtSecret === '') {
      throw new Error('A variável de ambiente JWT_SECRET não está definida.')
    }

    const data = jwt.verify(token, jwtSecret)
    const { userId } = data as TokenPayload

    req.userId = userId

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' })
  }
}
