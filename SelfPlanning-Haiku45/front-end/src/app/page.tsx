"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function HomeContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <header className="bg-white dark:bg-zinc-900 shadow">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">SelfPlanning</h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-700 dark:text-zinc-300">{user?.nome}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
            >
              Sair
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Bem-vindo, {user?.nome}!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Email: {user?.email}
          </p>
          <div className="flex gap-4">
            <a
              href="/boards"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition inline-block"
            >
              Meus Quadros
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
