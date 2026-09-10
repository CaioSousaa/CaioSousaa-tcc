"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, nome, senha);
      router.push("/");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao cadastrar";
      setError(errorMsg || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Cadastro
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Sua senha"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Faça login
          </a>
        </p>
      </form>
    </div>
  );
}
