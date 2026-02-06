export default function AdminPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
          <p className="text-zinc-400">Bem-vindo de volta, Admin.</p>
        </div>
        <button className="rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white hover:bg-green-700 transition-all shadow-lg shadow-green-900/20">
          + Criar Campanha
        </button>
      </header>

      {/* Grid de Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Tráfego Total</h3>
            <span className="text-2xl">🌐</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">12,450</span>
            <span className="ml-2 text-sm text-green-500">+12% hoje</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Bots Bloqueados</h3>
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">4,203</span>
            <span className="ml-2 text-sm text-red-500">Protegido</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Money Page (Reais)</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">8,247</span>
            <span className="ml-2 text-sm text-blue-500">66% Taxa</span>
          </div>
        </div>
      </div>

      {/* Tabela Recente */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h3 className="font-bold text-white">Campanhas Ativas</h3>
        </div>
        <div className="p-6">
            <div className="rounded-lg bg-zinc-950/50 p-8 text-center border border-dashed border-zinc-800">
                <p className="text-zinc-500">Nenhuma campanha rodando no momento.</p>
            </div>
        </div>
      </div>
    </div>
  );
}