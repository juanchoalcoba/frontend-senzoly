import React from 'react';
import { History, Filter, DollarSign, Calendar, CreditCard, User, Briefcase } from 'lucide-react';

export default function FinanceMovementsTable({
  movements = [],
  employees = [],
  services = [],
  filters = {},
  onFilterChange,
  loading,
}) {
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentMethodBadges = {
    CASH: { label: 'Efectivo', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    TRANSFER: { label: 'Transferencia', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    CARD: { label: 'Tarjeta', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    MERCADOPAGO: { label: 'MercadoPago', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-6 overflow-hidden">
      {/* Header & Filtros */}
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">Historial de Movimientos Financieros</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Registro auditado e inmutable de ingresos por servicios completados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Filtro Empleado */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filters.employeeId || ''}
              onChange={(e) => onFilterChange({ ...filters, employeeId: e.target.value })}
              className="bg-transparent w-full focus:outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="">Todos los profesionales</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Servicio */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filters.serviceId || ''}
              onChange={(e) => onFilterChange({ ...filters, serviceId: e.target.value })}
              className="bg-transparent w-full focus:outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="">Todos los servicios</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Método de Pago */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filters.paymentMethod || ''}
              onChange={(e) => onFilterChange({ ...filters, paymentMethod: e.target.value })}
              className="bg-transparent w-full focus:outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="">Todos los métodos de pago</option>
              <option value="CASH">Efectivo</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="CARD">Tarjeta</option>
              <option value="MERCADOPAGO">MercadoPago</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="p-8 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : movements.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700 text-sm">No se encontraron movimientos financieros</p>
          <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros seleccionados arriba.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="p-3.5 pl-6">Fecha / Hora</th>
                <th className="p-3.5">Cliente</th>
                <th className="p-3.5">Servicio</th>
                <th className="p-3.5">Empleado</th>
                <th className="p-3.5 text-center">Método Pago</th>
                <th className="p-3.5 text-right">Monto Bruto</th>
                <th className="p-3.5 text-right">Pago Empleado</th>
                <th className="p-3.5 text-right">Neto Negocio</th>
                <th className="p-3.5 pr-6">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((mov) => {
                const badge = paymentMethodBadges[mov.paymentMethod] || {
                  label: mov.paymentMethod || 'Efectivo',
                  color: 'bg-slate-100 text-slate-700 border-slate-200',
                };

                return (
                  <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 pl-6 text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(mov.createdAt)}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {mov.customerName || 'Cliente ocasional'}
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {mov.serviceName}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {mov.employeeName || 'Sin asignar'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-900">
                      {formatMoney(mov.grossAmount)}
                    </td>
                    <td className="p-3.5 text-right font-medium text-blue-600">
                      {formatMoney(mov.employeePayout)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-600">
                      {formatMoney(mov.businessNetIncome)}
                    </td>
                    <td className="p-3.5 pr-6 text-slate-400 max-w-xs truncate italic">
                      {mov.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
