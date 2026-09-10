import { Router, Response } from "express";
import { AppDataSource } from "../database";
import { Board } from "../entities/Board";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();
const boardRepository = AppDataSource.getRepository(Board);

function validateTitle(titulo: unknown): boolean {
  if (typeof titulo !== "string") return false;
  return titulo.trim().length > 0 && titulo.length <= 100;
}

async function checkBoardOwnership(
  boardId: string,
  userId: string
): Promise<Board | null> {
  return boardRepository.findOne({
    where: { id: boardId, usuarioId: userId },
  });
}

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const { titulo, descricao, corFundo } = req.body;

    if (!validateTitle(titulo)) {
      res.status(400).json({ error: "Título inválido (1-100 caracteres)" });
      return;
    }

    const board = boardRepository.create({
      usuarioId: req.userId,
      titulo: titulo.trim(),
      descricao: descricao || undefined,
      corFundo: corFundo || "#3b82f6",
    });

    await boardRepository.save(board);

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar quadro" });
  }
});

router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const boards = await boardRepository.find({
      where: { usuarioId: req.userId },
      order: { dataCriacao: "DESC" },
    });

    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar quadros" });
  }
});

router.get("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const board = await checkBoardOwnership(id, req.userId);

    if (!board) {
      res.status(404).json({ error: "Quadro não encontrado" });
      return;
    }

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar quadro" });
  }
});

router.patch("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const { titulo, descricao, corFundo } = req.body;

    const board = await checkBoardOwnership(id, req.userId);
    if (!board) {
      res.status(404).json({ error: "Quadro não encontrado" });
      return;
    }

    if (titulo !== undefined) {
      if (!validateTitle(titulo)) {
        res.status(400).json({ error: "Título inválido (1-100 caracteres)" });
        return;
      }
      board.titulo = titulo.trim();
    }

    if (descricao !== undefined) {
      board.descricao = descricao || undefined;
    }

    if (corFundo !== undefined) {
      board.corFundo = corFundo;
    }

    await boardRepository.save(board);

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar quadro" });
  }
});

router.delete(
  "/:id",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }
      const board = await checkBoardOwnership(id, req.userId);

      if (!board) {
        res.status(404).json({ error: "Quadro não encontrado" });
        return;
      }

      await boardRepository.remove(board);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar quadro" });
    }
  }
);

export default router;
