import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch orders if user is logged in
  let orders = [];
  let totalRevenue = 0;
  let totalPaidOrders = 0;
  
  if (user) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("company_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
      
    if (data) {
      orders = data;
      const { data: allOrders } = await supabase
        .from("orders")
        .select("total, status")
        .eq("company_id", user.id)
        .eq("status", "pagado");
        
      if (allOrders) {
        totalPaidOrders = allOrders.length;
        totalRevenue = allOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
      }
    }
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
        <p className="text-gray-400">Aquí tienes un resumen de tu negocio de hoy.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Mensajes Respondidos por IA</h3>
          <p className="text-4xl font-bold text-white">Activo</p>
          <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
            <span>En línea</span>
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Órdenes Pagadas</h3>
          <p className="text-4xl font-bold text-white">{totalPaidOrders}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2 relative z-10">Ingresos (Mercado Pago)</h3>
          <p className="text-4xl font-bold text-white relative z-10">$ {totalRevenue.toLocaleString()}</p>
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  Aún no hay órdenes recientes.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] font-bold text-xs">
                        {order.user_phone ? order.user_phone.slice(-2) : '??'}
                      </div>
                      <span className="text-gray-200">+{order.user_phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {order.status === 'pagado' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Pagado</span>
                    ) : order.status === 'cancelada' ? (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">Cancelada</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium">Pendiente</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">$ {order.total?.toLocaleString() || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
