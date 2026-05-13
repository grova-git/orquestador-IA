"use client";

import { useState, useEffect } from "react";
import { Save, Key, MessageSquare, CreditCard, Bot } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ConfigData {
  whatsapp_phone_number_id: string;
  whatsapp_access_token: string;
  mercadopago_access_token: string;
  system_prompt: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<ConfigData>({
    whatsapp_phone_number_id: "",
    whatsapp_access_token: "",
    mercadopago_access_token: "",
    system_prompt: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchConfig = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const res = await fetch(`${API_URL}/api/companies/config`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConfig({
          whatsapp_phone_number_id: data.whatsapp_phone_number_id || "",
          whatsapp_access_token: data.whatsapp_access_token || "",
          mercadopago_access_token: data.mercadopago_access_token || "",
          system_prompt: data.system_prompt || "",
        });
      }
    } catch (error) {
      console.error("Error al obtener configuración:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch(`${API_URL}/api/companies/config`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Configuración guardada exitosamente");
      } else {
        setMessage(data.detail || "Error al guardar");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-gray-400">Gestiona las integraciones y personalidad de tu IA</p>
      </header>

      <div className="space-y-6">
        {/* WhatsApp Config */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-green-400" /> WhatsApp Cloud API
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number ID</label>
              <input 
                type="text" 
                name="whatsapp_phone_number_id"
                value={config.whatsapp_phone_number_id}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="Ej: 1158744353980655"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Access Token (Temporal o Permanente)</label>
              <input 
                type="password" 
                name="whatsapp_access_token"
                value={config.whatsapp_access_token}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="EA..."
              />
            </div>
          </div>
        </div>

        {/* Mercado Pago Config */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-400" /> Mercado Pago
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Production Access Token</label>
              <input 
                type="password" 
                name="mercadopago_access_token"
                value={config.mercadopago_access_token}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                placeholder="APP_USR-..."
              />
              <p className="text-xs text-gray-500 mt-2">Este token permite que el bot genere links de pago a tu cuenta automáticamente.</p>
            </div>
          </div>
        </div>

        {/* AI Prompt */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Bot size={20} className="text-purple-400" /> Personalidad de la IA
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">System Prompt</label>
              <textarea 
                name="system_prompt"
                value={config.system_prompt}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 resize-none"
                placeholder="Eres un vendedor amigable..."
              />
              <p className="text-xs text-gray-500 mt-2">Instrucciones básicas de comportamiento para tu asistente de WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} /> {loading ? "Guardando..." : "Guardar Configuración"}
          </button>
          {message && <span className="text-sm text-green-400 font-medium">{message}</span>}
        </div>
      </div>
    </div>
  );
}
