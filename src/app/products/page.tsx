"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const supabase = createClient();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchProducts = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const res = await fetch(`${API_URL}/api/products/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/products/bulk`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFile(null);
        fetchProducts(); // Refresh list
      } else {
        setMessage(data.detail || "Error al subir CSV");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Productos</h1>
        <p className="text-gray-400">Gestiona tu inventario para la IA</p>
      </header>

      {/* Upload CSV Section */}
      <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/5">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Upload size={20} /> Carga Masiva (CSV)
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-[#25D366] hover:bg-[#20b858] text-black px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Subiendo..." : "Subir CSV"}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-[#25D366]">{message}</p>}
      </div>

      {/* Filters Section */}
      <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/5 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-400 mb-2">Precio Mínimo ($)</label>
          <input 
            type="number" 
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-400 mb-2">Precio Máximo ($)</label>
          <input 
            type="number" 
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ilimitado"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50"
          />
        </div>
        <button 
          onClick={() => { setMinPrice(""); setMaxPrice(""); }}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors h-[42px] w-full sm:w-auto"
        >
          Limpiar
        </button>
      </div>

      {/* Product List */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Nombre</th>
              <th className="px-6 py-4 font-medium">Descripción</th>
              <th className="px-6 py-4 font-medium">Precio</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(() => {
              const filteredProducts = products.filter(p => {
                const min = minPrice === "" ? 0 : parseFloat(minPrice);
                const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
                return p.price >= min && p.price <= max;
              });

              if (products.length === 0) {
                return (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <Package className="mx-auto mb-2 opacity-50" size={32} />
                      No tienes productos aún. Sube un archivo CSV.
                    </td>
                  </tr>
                );
              }

              if (filteredProducts.length === 0) {
                return (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron productos en ese rango de precios.
                    </td>
                  </tr>
                );
              }

              return filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={p.description}>{p.description || "-"}</td>
                  <td className="px-6 py-4 font-mono text-[#25D366]">${p.price}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
