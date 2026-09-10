"use client";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBoards, deleteBoard } from "@/lib/api";
import Link from "next/link";

interface Board {
  id: string;
  titulo: string;
  descricao?: string;
  corFundo: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

function BoardsContent() {
  const { logout } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    try {
      const response = await getBoards();
      setBoards(response.data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar quadros");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este quadro?")) return;

    try {
      await deleteBoard(id);
      setBoards(boards.filter((b) => b.id !== id));
    } catch (err) {
      setError("Erro ao deletar quadro");
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <header className="bg-white dark:bg-zinc-900 shadow">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">Meus Quadros</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <Link
            href="/boards/new"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
          >
            + Novo Quadro
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Carregando quadros...</div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <p className="mb-4">Você ainda não criou nenhum quadro.</p>
            <Link
              href="/boards/new"
              className="text-blue-600 hover:underline font-medium"
            >
              Crie o seu primeiro quadro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: board.corFundo }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-black dark:text-white mb-1">
                    {board.titulo}
                  </h2>
                  {board.descricao && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {board.descricao}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={`/boards/${board.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center text-sm font-medium transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(board.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BoardsPage() {
  return (
    <ProtectedRoute>
      <BoardsContent />
    </ProtectedRoute>
  );
}
