import React, { useEffect, useState } from 'react';
import { X, HandCoins, DollarSign, CreditCard, User, CheckCircle2, History } from 'lucide-react';
import { createEmployeePayout, getEmployeePayouts, getEmployeeDetail } from '../../services/financeApi';

export default function EmployeePayoutModal({ token, employees = [], initialEmployeeId, onSuccess, onClose }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
  const [notes, setNotes] = useState('');

  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [payoutsHistory, setPayoutsHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Carga el detalle y pagos acumulados del empleado seleccionado
  useEffect(() => {
    if (selectedEmployeeId) {
      setLoadingData(true);
      Promise.all([
        getEmployeeDetail(token, selectedEmployeeId),
        getEmployeePayouts(token, { employeeId: selectedEmployeeId }),
      ])
        .then(([detailRes, payoutsRes]) => {
          setEmployeeDetail(detailRes);
          setPayoutsHistory(payoutsRes || []);
          // Autocompletar el monto con el saldo pendiente
          const totalEarned = detailRes?.overview?.payoutTotal || 0;
          const totalPaid = (payoutsRes || []).reduce((acc, p) => acc + p.amount, 0);
          const pending = Math.max(totalEarned - totalPaid, 0);
          setAmount(pending > 0 ? pending.toString() : '');
        })
        .catch(console.error)
        .finally(() => setLoadingData(false));
    }
  }, [selectedEmployeeId, token]);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalEarned = employeeDetail?.overview?.payoutTotal || 0;
  const totalPaid = payoutsHistory.reduce((acc, p) => acc + p.amount, 0);
  const pendingBalance = totalEarned - totalPaid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError('Selecciona un empleado');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Ingresa un monto válido a liquidar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createEmployeePayout(token, {
        employeeId: selectedEmployeeId,
        amount: parseFloat(amount),
        paymentMethod,
        notes,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar la liquidación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-blue-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Liquidar Comisiones a Empleado</h2>
              <p className="text-xs text-slate-500">Registra el pago de haberes/comisiones al profesional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Selector de Empleado */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Profesional a Liquidar *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Selecciona un profesional...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumen de Saldo del Empleado */}
            {selectedEmployeeId && (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                {loadingData ? (
                  <p className="text-xs text-slate-400">Calculando saldo del profesional...</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Comisión Acumulada</span>
                      <span className="text-sm font-bold text-slate-900">{formatMoney(totalEarned)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Ya Abonado</span>
                      <span className="text-sm font-bold text-emerald-600">{formatMoney(totalPaid)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Saldo Pendiente</span>
                      <span className={`text-sm font-bold ${pendingBalance > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                        {formatMoney(pendingBalance)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Monto y Forma de Pago */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monto a Abonar ($) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medio de Pago *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="TRANSFER">Transferencia Bancaria</option>
                    <option value="CASH">Efectivo</option>
                    <option value="MERCADOPAGO">MercadoPago</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Referencia / Notas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Notas / Referencia de Transferencia
              </label>
              <input
                type="text"
                placeholder="Ej: Pago de comisiones semana del 20 al 27..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Historial previo de liquidaciones a este empleado */}
            {selectedEmployeeId && payoutsHistory.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Historial de Pagos Realizados ({payoutsHistory.length})
                  </h4>
                </div>
                <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                  {payoutsHistory.map((p) => (
                    <div key={p.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <span className="font-semibold text-slate-800">{formatDate(p.createdAt)}</span>
                        <span className="text-slate-400 block text-[10px]">{p.paymentMethod} {p.notes ? `· ${p.notes}` : ''}</span>
                      </div>
                      <span className="font-bold text-emerald-600">{formatMoney(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedEmployeeId}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 shadow-md shadow-blue-600/20"
            >
              {loading ? 'Registrando...' : 'Confirmar Liquidación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
