export default function Home() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
        <p className="text-gray-400">Aquí tienes un resumen de tu negocio de hoy.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Mensajes Respondidos por IA</h3>
          <p className="text-4xl font-bold text-white">124</p>
          <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
            <span>+12%</span> respecto ayer
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Órdenes Pagadas</h3>
          <p className="text-4xl font-bold text-white">32</p>
          <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
            <span>+5%</span> respecto ayer
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2 relative z-10">Ingresos (Mercado Pago)</h3>
          <p className="text-4xl font-bold text-white relative z-10">$ 45,200</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-sm">
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] font-bold text-xs">MA</div>
                  <span className="text-gray-200">Martín +54 9 11...</span>
                </div>
              </td>
              <td className="p-4"><span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Pagado</span></td>
              <td className="p-4 text-gray-300">$ 1,250</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">L</div>
                  <span className="text-gray-200">Laura +54 9 351...</span>
                </div>
              </td>
              <td className="p-4"><span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium">Humano Requerido</span></td>
              <td className="p-4 text-gray-300">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
