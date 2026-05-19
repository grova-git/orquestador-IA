import { createClient } from "@/utils/supabase/server";
import { OrderList } from "@/components/OrderList";

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
        .select("subtotal, status")
        .eq("company_id", user.id)
        .eq("status", "pagado");
        
      if (allOrders) {
        totalPaidOrders = allOrders.length;
        totalRevenue = allOrders.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
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
      <OrderList orders={orders} />
    </div>
  );
}
