"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, CreditCard, Calendar } from "lucide-react";

export function OrderList({ orders }: { orders: any[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (id: string) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 text-gray-400 text-sm">
            <th className="p-4 font-medium">Cliente</th>
            <th className="p-4 font-medium">Estado</th>
            <th className="p-4 font-medium">Monto</th>
            <th className="p-4 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Aún no hay órdenes recientes.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              
              return (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-white/5' : ''}`}
                    onClick={() => toggleOrder(order.id)}
                  >
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
                    <td className="p-4 text-gray-300 font-medium">$ {order.subtotal?.toLocaleString() || 0}</td>
                    <td className="p-4 text-gray-500">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-black/20 border-b border-white/5">
                      <td colSpan={4} className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Detalles del Cliente / Pago */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <CreditCard size={16} className="text-blue-400" />
                              Información de Pago
                            </h4>
                            <div className="space-y-2 text-sm text-gray-300">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">ID Operación (MP):</span>
                                <span className="font-mono text-xs">{order.payment_id || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">ID Conversación:</span>
                                <span className="font-mono text-xs truncate max-w-[150px]" title={order.conversation_id}>{order.conversation_id || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">Fecha de Creación:</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} /> 
                                  {new Date(order.created_at).toLocaleString('es-AR')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Lista de Productos */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Package size={16} className="text-[#25D366]" />
                              Productos ({order.items?.length || 0})
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                      <span className="text-gray-200 font-medium">{item.name}</span>
                                      <span className="text-gray-500 text-xs">{item.quantity} x ${item.unit_price}</span>
                                    </div>
                                    <span className="text-gray-300 font-medium">
                                      ${(item.quantity * item.unit_price).toLocaleString()}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">No hay detalles de productos.</p>
                              )}
                              
                              <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center">
                                <span className="text-gray-400 font-medium uppercase text-xs">Total Facturado</span>
                                <span className="text-[#25D366] font-bold text-lg">${order.subtotal?.toLocaleString() || 0}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
