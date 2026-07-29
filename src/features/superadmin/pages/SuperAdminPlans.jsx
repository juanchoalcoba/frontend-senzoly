import React, { useEffect, useState } from 'react';
import { getSuperAdminPlans } from '../../auth/services/authApi';
import {
  Layers,
  CheckCircle,
  XCircle,
  Users,
  MapPin,
  Infinity,
  Calendar,
  Loader2,
  Sparkles,
  Building2,
} from 'lucide-react';

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    maximumFractionDigits: 0
  }).format(val || 0);

const formatLimit = (val) => {
  if (val === -1 || val === '-1') return '∞';
  return val;
};

const LimitBadge = ({ value, label, icon: Icon }) => (
  <div className="flex items-center gap-1.5 text-xs text-slate-600">
    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    <span className="font-semibold">{formatLimit(value)}</span>
    <span className="text-slate-400">{label}</span>
  </div>
);

export default function SuperAdminPlans() {
  const token = localStorage.getItem('token');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSuperAdminPlans(token);
        setPlans(data);
      } catch (err) {
        setError(err.message || 'Error al cargar planes');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const activePlans = plans.filter((p) => p.is_active);
  const totalSubscriptions = plans.reduce((acc, p) => acc + (p.subscriptions_count || 0), 0);

  const planColors = [
    { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600', accent: 'text-slate-600', iconBg: 'bg-slate-100' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', accent: 'text-indigo-700', iconBg: 'bg-indigo-100' },
    { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', accent: 'text-orange-700', iconBg: 'bg-orange-100' },
    { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', accent: 'text-purple-700', iconBg: 'bg-purple-100' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-700', iconBg: 'bg-emerald-100' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Planes de suscripción disponibles en la plataforma y sus métricas de adopción.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Planes activos</p>
            <p className="text-2xl font-bold text-slate-900">{activePlans.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Suscripciones</p>
            <p className="text-2xl font-bold text-indigo-600">{totalSubscriptions}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan, idx) => {
          const color = planColors[idx % planColors.length];
          const isPaid = plan.price > 0;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 ${color.border} ${color.bg} p-6 shadow-sm flex flex-col gap-5 transition-shadow hover:shadow-md`}
            >
              {/* Estado */}
              <div className="absolute top-4 right-4">
                {plan.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-3 h-3" /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <XCircle className="w-3 h-3" /> Inactivo
                  </span>
                )}
              </div>

              {/* Nombre y precio */}
              <div>
                <div className={`w-10 h-10 rounded-xl ${color.iconBg} flex items-center justify-center mb-3`}>
                  {isPaid ? (
                    <Sparkles className={`w-5 h-5 ${color.accent}`} />
                  ) : (
                    <Layers className={`w-5 h-5 ${color.accent}`} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-mono">{plan.slug}</p>
                <div className="mt-3">
                  {isPaid ? (
                    <>
                      <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(plan.price)}</span>
                      <span className="text-slate-500 text-sm font-medium"> / {plan.billing_period === 'MONTHLY' ? 'mes' : 'año'}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-emerald-600">Gratis</span>
                  )}
                </div>
              </div>

              {/* Límites */}
              <div className="grid grid-cols-2 gap-2 bg-white/60 rounded-xl p-3 border border-white">
                <LimitBadge value={plan.max_users} label="usuarios" icon={Users} />
                <LimitBadge value={plan.max_locations} label="sucursales" icon={MapPin} />
                <LimitBadge value={plan.max_resources} label="recursos" icon={Building2} />
                <LimitBadge value={plan.max_bookings} label="reservas" icon={Calendar} />
              </div>

              {/* Métricas de adopción */}
              <div className="flex items-center justify-between pt-1 border-t border-white/80">
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-medium">Total suscritos</p>
                  <p className="text-xl font-bold text-slate-900">{plan.subscriptions_count || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-medium">Activos</p>
                  <p className="text-xl font-bold text-emerald-600">{plan.active_tenants || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-medium">En Trial</p>
                  <p className="text-xl font-bold text-amber-600">{plan.trial_tenants || 0}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla resumen */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Resumen de Planes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Plan</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4">Período</th>
                <th className="py-3 px-4 text-center">Max Usuarios</th>
                <th className="py-3 px-4 text-center">Max Sucursales</th>
                <th className="py-3 px-4 text-center">Max Reservas</th>
                <th className="py-3 px-4 text-center">Suscritos</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{plan.name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</td>
                  <td className="py-3.5 px-4 text-slate-600 uppercase text-xs">{plan.billing_period}</td>
                  <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{formatLimit(plan.max_users)}</td>
                  <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{formatLimit(plan.max_locations)}</td>
                  <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{formatLimit(plan.max_bookings)}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-600">{plan.subscriptions_count || 0}</td>
                  <td className="py-3.5 px-4 text-center">
                    {plan.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                        <XCircle className="w-3 h-3" /> Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3">
        <Layers className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-indigo-900">Gestión de planes</p>
          <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
            La creación, modificación y activación/desactivación de planes se realiza directamente en la base de datos
            o a través de migraciones SQL. La edición visual estará disponible en una próxima versión del panel.
          </p>
        </div>
      </div>
    </div>
  );
}
