"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ListColumn } from "@/components/ListColumn";
import { getBoardById, getLists, createList, updateList, reorderList, deleteList } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

interface Board {
  id: string;
  titulo: string;
  descricao?: string;
  corFundo: string;
}

interface List {
  id: string;
  titulo: string;
  ordem: number;
}

function BoardViewContent() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [novaLista, setNovaLista] = useState("");

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  async function loadBoard() {
    try {
      const boardResp = await getBoardById(boardId);
      setBoard(boardResp.data);

      const listsResp = await getLists(boardId);
      setLists(listsResp.data);
      setError("");
    } catch (err) {
      setError("Quadro não encontrado");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateList(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!novaLista.trim()) {
      setError("Nome da lista não pode estar vazio");
      return;
    }

    try {
      const resp = await createList(boardId, novaLista);
      setLists([...lists, resp.data]);
      setNovaLista("");
      setShowCreateForm(false);
    } catch (err) {
      setError("Erro ao criar lista");
    }
  }

  async function handleRename(listId: string, novoTitulo: string) {
    try {
      const resp = await updateList(boardId, listId, novoTitulo);
      setLists(lists.map((l) => (l.id === listId ? resp.data : l)));
    } catch (err) {
      setError("Erro ao renomear lista");
    }
  }

  async function handleDelete(listId: string) {
    if (!confirm("Tem certeza que deseja deletar esta lista?")) return;

    try {
      await deleteList(boardId, listId);
      setLists(lists.filter((l) => l.id !== listId));
    } catch (err) {
      setError("Erro ao deletar lista");
    }
  }

  async function handleReorder(listId: string, novaOrdem: number) {
    try {
      await reorderList(boardId, listId, novaOrdem);
      await loadBoard();
    } catch (err) {
      setError("Erro ao reordenar lista");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Carregando...</div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
        <header className="bg-white dark:bg-zinc-900 shadow">
          <nav className="max-w-full mx-auto px-4 py-4">
            <button
              onClick={() => router.push("/boards")}
              className="text-blue-600 hover:underline"
            >
              ← Voltar
            </button>
          </nav>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push("/boards")}
              className="text-blue-600 hover:underline"
            >
              Voltar para quadros
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: board.corFundo }}
    >
      <header className="bg-white dark:bg-zinc-900 shadow">
        <nav className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/boards")}
              className="text-blue-600 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {board.titulo}
            </h1>
          </div>
          <Link
            href={`/boards/${boardId}/settings`}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition"
          >
            Configurações
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-4 py-8 overflow-x-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-6 pb-8">
          {lists.map((list, index) => (
            <ListColumn
              key={list.id}
              list={list}
              onRename={handleRename}
              onDelete={handleDelete}
              onReorderUp={async () => {
                if (index > 0) await handleReorder(list.id, index);
              }}
              onReorderDown={async () => {
                if (index < lists.length - 1) await handleReorder(list.id, index + 2);
              }}
            />
          ))}

          <div className="min-w-[300px]">
            {showCreateForm ? (
              <form
                onSubmit={handleCreateList}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4"
              >
                <input
                  type="text"
                  value={novaLista}
                  onChange={(e) => setNovaLista(e.target.value)}
                  maxLength={50}
                  placeholder="Nome da nova lista"
                  autoFocus
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white mb-3"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                  >
                    Criar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNovaLista("");
                    }}
                    className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 hover:bg-white/70 dark:hover:bg-zinc-900/70 rounded-lg shadow-md font-medium text-black dark:text-white transition"
              >
                + Nova Lista
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BoardViewPage() {
  return (
    <ProtectedRoute>
      <BoardViewContent />
    </ProtectedRoute>
  );
}
