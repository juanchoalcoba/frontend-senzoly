import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';

export default function FinanceChart({ data = [], grouping = 'daily', onGroupingChange, loading }) {
  const [activeHover, setActiveHover] = useState(null);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    if (grouping === 'monthly') {
      return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    }
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-slate-300 animate-bounce" />
        </div>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.grossTotal || 0, Math.abs(d.netTotal || 0), d.payoutTotal || 0)), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      {/* Header del Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900">Evolución Financiera</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Comparativa de facturación bruta, ingresos netos del negocio y comisiones</p>
        </div>

        {/* Switcher de Agrupación */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {[
            { id: 'daily', label: 'Diario' },
            { id: 'weekly', label: 'Semanal' },
            { id: 'monthly', label: 'Mensual' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onGroupingChange(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                grouping === item.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-6 mb-6 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-700">Ingresos Brutos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
          <span className="text-slate-700">Neto Negocio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-slate-700">Egresos / Pérdida</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
          <span className="text-slate-700">Pago a Empleados</span>
        </div>
      </div>

      {/* Gráfico de Barras SVG */}
      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center p-6">
          <Calendar className="w-10 h-10 text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700 text-sm">No hay registros financieros en este período</p>
          <p className="text-xs text-slate-400 mt-1">Los movimientos aparecerán automáticamente al completar turnos o registrar egresos.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8 pb-6 px-2 overflow-x-auto border-b border-slate-200 scrollbar-thin">
            {data.map((item, index) => {
              const grossHeight = Math.max(((item.grossTotal || 0) / maxVal) * 100, 4);
              const isNegativeNet = (item.netTotal || 0) < 0;
              const netHeight = Math.max((Math.abs(item.netTotal || 0) / maxVal) * 100, 4);
              const payoutHeight = Math.max(((item.payoutTotal || 0) / maxVal) * 100, 4);

              const isFirst = index === 0;
              const isLast = index >= data.length - 2 && data.length > 2;
              const alignClass = isFirst ? 'left-0' : isLast ? 'right-0' : 'left-1/2 -translate-x-1/2';

              return (
                <div
                  key={index}
                  className="flex-1 min-w-[3.5rem] max-w-[5rem] flex flex-col items-center group relative cursor-pointer"
                  onMouseEnter={() => setActiveHover(item)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {/* Tooltip Hover */}
                  {activeHover === item && (
                    <div className={`absolute bottom-full mb-2 z-30 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-2xl whitespace-nowrap border border-slate-800 pointer-events-none transition-all ${alignClass}`}>
                      <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-slate-300">
                        {formatDateLabel(item.date)}
                      </p>
                      <p className="text-emerald-400">Bruto: {formatMoney(item.grossTotal)}</p>
                      <p className={isNegativeNet ? 'text-red-400 font-bold' : 'text-orange-400'}>
                        Neto: {formatMoney(item.netTotal)} {isNegativeNet ? '(Déficit)' : ''}
                      </p>
                      <p className="text-blue-400">Staff: {formatMoney(item.payoutTotal)}</p>
                      <p className="text-slate-400 text-[10px] mt-1">{item.count} servicios completados</p>
                    </div>
                  )}

                  {/* Grupo de 3 Barras */}
                  <div className="w-full h-full flex items-end justify-center gap-1">
                    <div
                      style={{ height: `${grossHeight}%` }}
                      className="w-1/3 bg-emerald-500 group-hover:bg-emerald-400 rounded-t transition-all duration-300"
                    ></div>
                    <div
                      style={{ height: `${netHeight}%` }}
                      className={`w-1/3 rounded-t transition-all duration-300 ${
                        isNegativeNet
                          ? 'bg-red-500 group-hover:bg-red-400'
                          : 'bg-orange-500 group-hover:bg-orange-400'
                      }`}
                    ></div>
                    <div
                      style={{ height: `${payoutHeight}%` }}
                      className="w-1/3 bg-blue-500 group-hover:bg-blue-400 rounded-t transition-all duration-300"
                    ></div>
                  </div>

                  {/* Etiqueta Eje X */}
                  <span className="text-[11px] font-medium text-slate-500 truncate w-full text-center mt-2 group-hover:text-slate-900">
                    {formatDateLabel(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
