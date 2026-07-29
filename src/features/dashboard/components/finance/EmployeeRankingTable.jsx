import React, { useState } from 'react';
import { Users, ArrowUpDown, ChevronRight, Award } from 'lucide-react';

export default function EmployeeRankingTable({ ranking = [], onSelectEmployee, loading }) {
  const [sortField, setSortField] = useState('netTotal');
  const [sortOrder, setSortOrder] = useState('desc');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedRanking = [...ranking].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-6 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Rendimiento por Profesional</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Haz clic en cualquier profesional para ver su historial y métricas detalladas</p>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <p className="font-medium text-slate-600 text-sm">No hay registros de profesionales en este rango de fechas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6 cursor-pointer hover:text-slate-900" onClick={() => handleSort('employeeName')}>
                  <div className="flex items-center gap-1">
                    Empleado <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center cursor-pointer hover:text-slate-900" onClick={() => handleSort('servicesCount')}>
                  <div className="flex items-center justify-center gap-1">
                    Servicios <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('grossTotal')}>
                  <div className="flex items-center justify-end gap-1">
                    Facturado Bruto <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('payoutTotal')}>
                  <div className="flex items-center justify-end gap-1">
                    Comisión Pagada <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('netTotal')}>
                  <div className="flex items-center justify-end gap-1">
                    Neto Negocio <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('avgTicket')}>
                  <div className="flex items-center justify-end gap-1">
                    Ticket Prom. <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 pr-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRanking.map((emp, index) => (
                <tr
                  key={emp.employeeId || index}
                  onClick={() => emp.employeeId && onSelectEmployee(emp.employeeId)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 pl-6 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {index === 0 ? <Award className="w-4 h-4 text-amber-500" /> : index + 1}
                    </div>
                    <span>{emp.employeeName}</span>
                  </td>
                  <td className="p-4 text-center font-medium text-slate-700">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      {emp.servicesCount}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-slate-900">
                    {formatMoney(emp.grossTotal)}
                  </td>
                  <td className="p-4 text-right font-medium text-blue-600">
                    {formatMoney(emp.payoutTotal)}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600">
                    {formatMoney(emp.netTotal)}
                  </td>
                  <td className="p-4 text-right font-medium text-slate-600">
                    {formatMoney(emp.avgTicket)}
                  </td>
                  <td className="p-4 pr-6 text-center text-slate-400 group-hover:text-indigo-600">
                    <ChevronRight className="w-5 h-5 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
