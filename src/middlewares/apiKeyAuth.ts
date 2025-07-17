import { type Request, type Response, type NextFunction } from "express";

export function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.ADMIN_API_KEY;

  if (validApiKey === null || validApiKey === undefined || validApiKey === "") {
    console.error("A variável de ambiente ADMIN_API_KEY não está definida.");
    return res.status(500).json({ error: "Erro de configuração do servidor." });
  }

  if (apiKey !== null && apiKey === validApiKey) {
    return next(); // Chave válida, continua
  }

  return res
    .status(401)
    .json({ error: "Chave de API inválida ou não fornecida." });
}
