import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authorization.split(" ");

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("A variável de ambiente JWT_SECRET não está definida.");
    }

    const data = jwt.verify(token, jwtSecret);
    const { userId } = data as TokenPayload;

    req.userId = userId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido." });
  }
}
