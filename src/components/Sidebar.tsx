import Link from "next/link";
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 h-screen glass-panel fixed left-0 top-0 flex flex-col p-6 z-50">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white">
          A
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Orchestrator
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
          <Package size={20} />
          <span className="font-medium">Catálogo</span>
        </Link>
        <Link href="/inbox" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white relative">
          <MessageSquare size={20} />
          <span className="font-medium">Inbox</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
          <Settings size={20} />
          <span className="font-medium">Ajustes (Pagos)</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
