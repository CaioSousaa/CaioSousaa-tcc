"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBoardApi, Board } from "@/hooks/useBoardApi";
import { useListApi, ListItem } from "@/hooks/useListApi";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BoardDetail() {
  const params = useParams();
  const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId || "";
  const router = useRouter();
  const { getBoard } = useBoardApi();
  const { getLists, createList, updateList, deleteList } = useListApi();

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadBoardData();
  }, [boardId]);

  const loadBoardData = async () => {
    try {
      setIsLoading(true);
      const boardData = await getBoard(boardId);
      setBoard(boardData);

      const listsData = await getLists(boardId);
      setLists(listsData);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar quadro";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      setError("Título da lista é obrigatório");
      return;
    }

    try {
      const newList = await createList(boardId, newListTitle);
      setLists([...lists, newList]);
      setNewListTitle("");
      setShowNewListForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar lista";
      setError(errorMessage);
    }
  };

  const handleRenameList = async (listId: string) => {
    if (!editingTitle.trim()) {
      setError("Título é obrigatório");
      return;
    }

    try {
      const updated = await updateList(listId, { title: editingTitle });
      setLists(lists.map((l) => (l.id === listId ? updated : l)));
      setEditingListId(null);
      setEditingTitle("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao renomear lista";
      setError(errorMessage);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      setLists(lists.filter((l) => l.id !== listId));
      setDeleteConfirmId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar lista";
      setError(errorMessage);
    }
  };

  const handleReorderList = async (listId: string, newPosition: number) => {
    if (newPosition < 0 || newPosition >= lists.length) return;

    try {
      const updatedList = await updateList(listId, { position: newPosition });
      const currentIndex = lists.findIndex((l) => l.id === listId);

      const newLists = lists.filter((l) => l.id !== listId);
      newLists.splice(newPosition, 0, updatedList);
      setLists(newLists);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao reordenar lista";
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">Carregando...</div>
      </ProtectedRoute>
    );
  }

  if (!board) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Quadro não encontrado</p>
            <Link href="/boards" className="text-blue-900 mt-4 inline-block">
              Voltar aos quadros
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: `${board.color}20` }}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/boards" className="text-gray-600 hover:text-gray-900">
                ←
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
                {board.description && <p className="text-gray-600 text-sm">{board.description}</p>}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-full mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Lists Grid */}
          <div className="flex gap-6 overflow-x-auto pb-6">
            {lists.map((list, index) => (
              <div
                key={list.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow p-4"
              >
                {/* List Header */}
                {editingListId === list.id ? (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRenameList(list.id)}
                      className="px-3 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingListId(null)}
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">{list.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingListId(list.id);
                          setEditingTitle(list.title);
                        }}
                        className="text-gray-500 hover:text-gray-900"
                        title="Renomear"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(list.id)}
                        className="text-gray-500 hover:text-red-600"
                        title="Deletar"
                      >
                        🗑
                      </button>
                      <div className="flex gap-0.5">
                        {index > 0 && (
                          <button
                            onClick={() => handleReorderList(list.id, index - 1)}
                            className="text-gray-500 hover:text-gray-900"
                            title="Mover esquerda"
                          >
                            ←
                          </button>
                        )}
                        {index < lists.length - 1 && (
                          <button
                            onClick={() => handleReorderList(list.id, index + 1)}
                            className="text-gray-500 hover:text-gray-900"
                            title="Mover direita"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation */}
                {deleteConfirmId === list.id && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700 mb-2">Deletar esta lista?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="flex-1 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty state for cards */}
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhum card ainda</p>
                </div>
              </div>
            ))}

            {/* Add New List */}
            {showNewListForm ? (
              <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow p-4">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Nome da lista..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateList}
                    className="flex-1 px-3 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                  >
                    Criar
                  </button>
                  <button
                    onClick={() => {
                      setShowNewListForm(false);
                      setNewListTitle("");
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewListForm(true)}
                className="flex-shrink-0 w-80 h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition flex items-center justify-center text-gray-600 font-medium"
              >
                + Nova Lista
              </button>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
