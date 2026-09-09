"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { BoardFormModal } from "@/components/BoardFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Board, BOARD_COLOR_CLASSES, BoardColor } from "@/lib/board-colors";

function QuadrosContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    setLoadingBoards(true);
    try {
      const response = await api.get("/boards");
      setBoards(response.data);
    } finally {
      setLoadingBoards(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  async function handleCreate(name: string, color: BoardColor) {
    const response = await api.post("/boards", { name, color });
    setBoards((prev) => [response.data, ...prev]);
    setShowCreateModal(false);
  }

  async function handleUpdate(name: string, color: BoardColor) {
    if (!editingBoard) return;
    const response = await api.patch(`/boards/${editingBoard.id}`, { name, color });
    setBoards((prev) => prev.map((b) => (b.id === editingBoard.id ? response.data : b)));
    setEditingBoard(null);
  }

  async function handleDelete() {
    if (!deletingBoard) return;
    setDeleting(true);
    try {
      await api.delete(`/boards/${deletingBoard.id}`);
      setBoards((prev) => prev.filter((b) => b.id !== deletingBoard.id));
      setDeletingBoard(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-sm font-semibold text-white">
            K
          </span>
          <span className="text-lg font-bold text-slate-900">Kanbo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meus quadros</h1>
            <p className="mt-1 text-sm text-slate-500">
              {boards.length} {boards.length === 1 ? "quadro" : "quadros"}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
          >
            + Novo quadro
          </button>
        </div>

        {loadingBoards ? (
          <p className="text-sm text-slate-500">Carregando quadros...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => router.push(`/quadros/${board.id}`)}
                className="cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm hover:border-slate-300"
              >
                <div className={`h-1.5 ${BOARD_COLOR_CLASSES[board.color]}`} />
                <div className="flex items-start justify-between p-4">
                  <h3 className="font-semibold text-slate-900">{board.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoard(board);
                      }}
                      aria-label="Editar quadro"
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingBoard(board);
                      }}
                      aria-label="Excluir quadro"
                      className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex min-h-26 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              <span className="text-xl">+</span>
              Criar quadro
            </button>
          </div>
        )}
      </main>

      {showCreateModal && (
        <BoardFormModal
          title="Novo quadro"
          confirmLabel="Criar quadro"
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingBoard && (
        <BoardFormModal
          title="Editar quadro"
          confirmLabel="Salvar"
          initialName={editingBoard.name}
          initialColor={editingBoard.color}
          onSubmit={handleUpdate}
          onClose={() => setEditingBoard(null)}
        />
      )}

      {deletingBoard && (
        <ConfirmDialog
          title={`Excluir o quadro "${deletingBoard.name}"?`}
          description="Essa ação é irreversível."
          confirmLabel="Excluir"
          submitting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingBoard(null)}
        />
      )}
    </div>
  );
}

export default function QuadrosPage() {
  return (
    <RequireAuth>
      <QuadrosContent />
    </RequireAuth>
  );
}
