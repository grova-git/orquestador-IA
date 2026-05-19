"use client";

import React, { useState } from "react";
import { Search, User, MessageSquare, Clock, ArrowLeft } from "lucide-react";

export function InboxView({ conversations }: { conversations: any[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedConversation = conversations.find(c => c.id === selectedId);

  const filteredConversations = conversations.filter(c => 
    c.user_phone.includes(searchTerm)
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Sidebar - Lista de Conversaciones */}
      <div className={`w-full md:w-1/3 border-r border-white/10 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Mensajes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar por número..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No hay conversaciones recientes.
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-3 ${selectedId === conv.id ? 'bg-white/10' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex-shrink-0 flex items-center justify-center text-[#25D366] font-bold">
                  {conv.user_phone.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-white font-medium truncate">+{conv.user_phone}</h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(conv.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate">
                      {conv.state === 'atencion' ? 'Atendiendo...' : 
                       conv.state === 'confirmacion_pedido' ? 'Confirmando pedido...' : 
                       conv.state === 'pago_pendiente' ? 'Esperando pago...' : conv.state}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-black/20 ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <button 
                onClick={() => setSelectedId(null)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] font-bold">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-white font-medium">+{selectedConversation.user_phone}</h2>
                <p className="text-xs text-[#25D366]">Estado: {selectedConversation.state}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.history
                .filter((msg: any) => 
                  // Filtrar mensajes técnicos
                  (msg.role === 'user') || 
                  (msg.role === 'assistant' && msg.content && typeof msg.content === 'string')
                )
                .map((msg: any, idx: number) => {
                  const isBot = msg.role === 'assistant';
                  return (
                    <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                      <div 
                        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                          isBot 
                            ? 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5' 
                            : 'bg-[#25D366] text-black rounded-tr-none'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              {selectedConversation.history.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-10">
                  Esta conversación acaba de iniciar.
                </div>
              )}
            </div>
            
            {/* Input simulado (solo lectura) */}
            <div className="p-4 border-t border-white/10 bg-black/40 text-center">
              <p className="text-xs text-gray-500">
                La IA está administrando esta conversación. Modo lectura únicamente.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p>Selecciona una conversación para ver los detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
