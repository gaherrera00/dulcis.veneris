import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  // Middleware manual no Next.js
  try {
    await new Promise((resolve, reject) =>
      authMiddleware(req, res, (result) =>
        result instanceof Error ? reject(result) : resolve(result)
      )
    );

    await new Promise((resolve, reject) =>
      roleMiddleware(req, res, (result) =>
        result instanceof Error ? reject(result) : resolve(result)
      )
    );
  } catch {
    return; // o middleware já respondeu o erro
  }

  const { nome, cpf, email, senha, perfil, lojaId } = req.body;

  if (!nome || !cpf || !email || !senha || !perfil) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  // Loja obrigatória para CAIXA e GERENTE
  if ((perfil === "CAIXA" || perfil === "GERENTE") && !lojaId) {
    return res.status(400).json({ message: "Selecione uma loja" });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        cpf,
        email,
        senha_hash: hash,
        perfil,
        loja_id: perfil === "ADMIN" ? null : parseInt(lojaId),
      },
    });

    res.status(201).json({ message: "Usuário criado com sucesso", user: novoUsuario });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(400).json({ message: "CPF ou email já cadastrado" });
    }
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
}
