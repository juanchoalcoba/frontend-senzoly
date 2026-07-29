import React, { useState } from 'react';
import { X, MinusCircle, DollarSign, Tag, CreditCard, AlignLeft } from 'lucide-react';
import { createExpense } from '../../services/financeApi';

export default function ExpenseModal({ token, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'SUPPLIES',
    paymentMethod: 'CASH',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'RENT', label: 'Alquiler / Arriendo' },
    { id: 'SUPPLIES', label: 'Insumos y Productos' },
    { id: 'UTILITIES', label: 'Servicios Públicos (Luz, Agua, Gas, Internet)' },
    { id: 'MAINTENANCE', label: 'Mantenimiento y Limpieza' },
    { id: 'MARKETING', label: 'Publicidad y Marketing' },
    { id: 'TAXES', label: 'Impuestos y Tasas' },
    { id: 'OTHER', label: 'Otro Egreso Operativo' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createExpense(token, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar el egreso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
              <MinusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registrar Egreso / Gasto</h2>
              <p className="text-xs text-slate-500">Descuenta este importe del balance del negocio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Monto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Monto del Gasto ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Categoría *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Forma de Pago *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="CASH">Efectivo</option>
                  <option value="TRANSFER">Transferencia Bancaria</option>
                  <option value="CARD">Tarjeta</option>
                  <option value="MERCADOPAGO">MercadoPago</option>
                </select>
              </div>
            </div>

            {/* Notas / Observaciones */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Descripción / Notas
              </label>
              <div className="relative">
                <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows="3"
                  placeholder="Detalle o factura del gasto realizado..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
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
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 shadow-md shadow-red-600/20"
            >
              {loading ? 'Guardando...' : 'Registrar Egreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
