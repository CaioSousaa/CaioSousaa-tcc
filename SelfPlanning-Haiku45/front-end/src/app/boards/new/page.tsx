"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { createBoard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function NewBoardContent() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [corFundo, setCorFundo] = useState("#3b82f6");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!titulo.trim()) {
        setError("Título é obrigatório");
        setLoading(false);
        return;
      }

      if (titulo.length > 100) {
        setError("Título deve ter no máximo 100 caracteres");
        setLoading(false);
        return;
      }

      await createBoard(titulo, descricao || undefined, corFundo);
      router.push("/boards");
    } catch (err) {
      setError("Erro ao criar quadro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <header className="bg-white dark:bg-zinc-900 shadow">
        <nav className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            ← Voltar
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
            Novo Quadro
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Projeto X"
              />
              <p className="text-xs text-zinc-500 mt-1">{titulo.length}/100</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Descrição opcional do quadro"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Cor de Fundo
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={corFundo}
                  onChange={(e) => setCorFundo(e.target.value)}
                  className="h-12 w-20 rounded-md cursor-pointer"
                />
                <div
                  className="h-12 w-32 rounded-md shadow-md"
                  style={{ backgroundColor: corFundo }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition"
              >
                {loading ? "Criando..." : "Criar Quadro"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-md font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewBoardPage() {
  return (
    <ProtectedRoute>
      <NewBoardContent />
    </ProtectedRoute>
  );
}
