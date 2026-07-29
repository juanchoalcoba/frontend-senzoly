import React, { useEffect, useState } from 'react';
import { X, User, Phone, Mail, DollarSign, TrendingUp, Award, CheckCircle2, Calendar } from 'lucide-react';
import { getEmployeeDetail } from '../../services/financeApi';

export default function EmployeeDetailModal({ employeeId, token, startDate, endDate, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employeeId) {
      setLoading(true);
      setError(null);
      getEmployeeDetail(token, employeeId, { startDate, endDate })
        .then((res) => setData(res))
        .catch((err) => setError(err.message || 'Error al obtener detalle del profesional'))
        .finally(() => setLoading(false));
    }
  }, [employeeId, token, startDate, endDate]);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
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

  if (!employeeId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {loading ? 'Cargando profesional...' : data?.employee?.name || 'Detalle del Profesional'}
              </h2>
              {data?.employee && (
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
                  {data.employee.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.employee.email}
                    </span>
                  )}
                  {data.employee.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.employee.phone}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
            </div>
          ) : error || !data ? (
            <div className="p-8 text-center text-red-500">
              <p className="font-semibold text-sm">{error || 'No se pudieron cargar los datos del empleado'}</p>
            </div>
          ) : (
            <>
              {/* Tarjetas resumen del empleado */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1">Bruto Generado</span>
                  <p className="text-lg font-extrabold text-emerald-900">{formatMoney(data.overview.grossTotal)}</p>
                </div>
                <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block mb-1">Comisión Staff</span>
                  <p className="text-lg font-extrabold text-blue-900">{formatMoney(data.overview.payoutTotal)}</p>
                </div>
                <div className="bg-orange-50/60 border border-orange-100 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-orange-800 uppercase tracking-wider block mb-1">Neto Negocio</span>
                  <p className="text-lg font-extrabold text-orange-900">{formatMoney(data.overview.netTotal)}</p>
                </div>
                <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
                  <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block mb-1">Servicios</span>
                  <p className="text-lg font-extrabold text-indigo-900">{data.overview.servicesCount}</p>
                </div>
                <div className="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider block mb-1">Ticket Prom.</span>
                  <p className="text-lg font-extrabold text-purple-900">{formatMoney(data.overview.avgTicket)}</p>
                </div>
              </div>

              {/* Historial de Movimientos de este Empleado */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Movimientos del Profesional ({data.movements.length})
                </h4>
                {data.movements.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No hay registros financieros para este profesional en el período seleccionado.</p>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                          <th className="p-3 pl-4">Fecha</th>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Servicio</th>
                          <th className="p-3 text-right">Bruto</th>
                          <th className="p-3 text-right">Comisión</th>
                          <th className="p-3 text-right pr-4">Neto Negocio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.movements.map((mov) => (
                          <tr key={mov.id} className="hover:bg-slate-50">
                            <td className="p-3 pl-4 text-slate-600 whitespace-nowrap">{formatDate(mov.createdAt)}</td>
                            <td className="p-3 font-semibold text-slate-900">{mov.customerName || 'Cliente'}</td>
                            <td className="p-3 font-medium text-slate-700">{mov.serviceName}</td>
                            <td className="p-3 text-right font-medium text-slate-900">{formatMoney(mov.grossAmount)}</td>
                            <td className="p-3 text-right font-semibold text-blue-600">{formatMoney(mov.employeePayout)}</td>
                            <td className="p-3 text-right font-bold text-emerald-600 pr-4">{formatMoney(mov.businessNetIncome)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
