"use client";

import { FormEvent, useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { getComments, createComment, updateComment, deleteComment } from "@/lib/api";

interface Comment {
  id: string;
  cardId: string;
  usuarioId: string;
  texto: string;
  dataCriacao: string;
  dataAtualizacao: string;
  usuario: {
    id: string;
    email: string;
    nome: string;
  };
}

interface Card {
  id?: string;
  titulo: string;
  descricao?: string;
  dataPrazo?: string;
}

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (titulo: string, descricao?: string, dataPrazo?: string) => Promise<void>;
  loading?: boolean;
  boardId?: string;
  listId?: string;
}

export function CardModal({
  card,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  boardId = "",
  listId = "",
}: CardModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (card) {
      setTitulo(card.titulo);
      setDescricao(card.descricao || "");
      if (card.dataPrazo) {
        const date = new Date(card.dataPrazo);
        const iso = date.toISOString().slice(0, 16);
        setDataPrazo(iso);
      } else {
        setDataPrazo("");
      }
      loadComments();
    } else {
      setTitulo("");
      setDescricao("");
      setDataPrazo("");
      setComments([]);
    }
    setError("");
  }, [card, isOpen]);

  async function loadComments() {
    if (!card?.id || !boardId || !listId) return;

    try {
      setLoadingComments(true);
      const res = await getComments(boardId, listId, card.id);
      setComments(res.data);
    } catch (err) {
      console.error("Erro ao carregar comentários", err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment(texto: string) {
    if (!card?.id || !boardId || !listId) return;

    try {
      const res = await createComment(boardId, listId, card.id, texto);
      setComments([res.data, ...comments]);
    } catch (err) {
      console.error("Erro ao criar comentário", err);
      throw err;
    }
  }

  async function handleEditComment(commentId: string, texto: string) {
    if (!card?.id || !boardId || !listId) return;

    try {
      const res = await updateComment(boardId, listId, card.id, commentId, texto);
      setComments(comments.map((c) => (c.id === commentId ? res.data : c)));
    } catch (err) {
      console.error("Erro ao editar comentário", err);
      throw err;
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!card?.id || !boardId || !listId) return;

    try {
      await deleteComment(boardId, listId, card.id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Erro ao deletar comentário", err);
      throw err;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("Título é obrigatório");
      return;
    }

    if (titulo.length > 100) {
      setError("Título máximo 100 caracteres");
      return;
    }

    try {
      await onSubmit(titulo, descricao || undefined, dataPrazo || undefined);
      onClose();
    } catch (err) {
      setError("Erro ao salvar cartão");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-2xl w-full my-8">
        <h2 className="text-lg font-bold text-black dark:text-white p-4 border-b border-zinc-200 dark:border-zinc-700">
          {card?.id ? "Editar Cartão" : "Novo Cartão"}
        </h2>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={100}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do cartão"
              autoFocus
            />
            <p className="text-xs text-zinc-500 mt-1">{titulo.length}/100</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descrição do cartão"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Prazo (opcional)
            </label>
            <input
              type="datetime-local"
              value={dataPrazo}
              onChange={(e) => setDataPrazo(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {dataPrazo && (
              <button
                type="button"
                onClick={() => setDataPrazo("")}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                Remover prazo
              </button>
            )}
          </div>

          {card?.id && (
            <div className="mb-6 border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Comentários</h3>
              {boardId && listId && (
                <>
                  <CommentForm onSubmit={handleAddComment} loading={loadingComments} />
                  <CommentList
                    comments={comments}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    loading={loadingComments}
                  />
                </>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
