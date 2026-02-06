export default function NewCampaign() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Nova Configuração de Cloaker</h1>
        <a href="/admin" className="text-zinc-400 hover:text-white">Cancelar</a>
      </div>

      <div className="space-y-6">
        {/* Nome e Slug */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nome da Campanha</label>
                <input type="text" placeholder="Ex: Black Friday - TikTok" className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (Link Amigável)</label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-zinc-800 bg-zinc-800 text-zinc-400 text-sm">
                        seusite.com/c/
                    </span>
                    <input type="text" placeholder="oferta-secreta" className="flex-1 rounded-r-lg bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-green-500 focus:outline-none" />
                </div>
            </div>
        </div>

        {/* White Page */}
        <div className="rounded-xl border border-yellow-500/20 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <h2 className="font-bold text-white">White Page (Página Segura)</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Para onde os robôs do Facebook/TikTok serão enviados.</p>
            <input type="url" placeholder="https://g1.globo.com/artigo-neutro" className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-yellow-500 focus:outline-none" />
        </div>

        {/* Black Page */}
        <div className="rounded-xl border border-green-500/20 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <h2 className="font-bold text-white">Black Page (Oferta Real)</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Para onde os clientes reais serão enviados (sua VSL/Página de Vendas).</p>
            <input type="url" placeholder="https://suaoferta.com/vsl" className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-green-500 focus:outline-none" />
        </div>

        <button className="w-full rounded-lg bg-green-600 p-4 font-bold text-white hover:bg-green-500 transition-all text-lg shadow-lg shadow-green-900/20">
            🛡️ BLINDAR LINK E CRIAR
        </button>
      </div>
    </div>
  );
}