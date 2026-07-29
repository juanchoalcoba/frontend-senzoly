import React, { useEffect, useState } from 'react';
import { getSuperAdminSubscriptions } from '../../auth/services/authApi';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Banknote,
} from 'lucide-react';

const statusConfig = {
  ACTIVE: { label: 'Activa', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  active: { label: 'Activa', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  TRIAL: { label: 'Trial', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  trial: { label: 'Trial', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  SUSPENDED: { label: 'Suspendida', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  suspended: { label: 'Suspendida', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
};

const paymentStatusConfig = {
  approved: { label: 'Aprobado', color: 'bg-emerald-100 text-emerald-800' },
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800' },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
};

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val || 0);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const StatCard = ({ icon: Icon, label, value, subLabel, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {subLabel && <p className="text-xs text-slate-400 mt-1">{subLabel}</p>}
  </div>
);

export default function SuperAdminSubscriptions() {
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getSuperAdminSubscriptions(token);
        setData(result);
      } catch (err) {
        setError(err.message || 'Error al cargar datos de suscripciones');
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

  const summary = data?.summary || {};
  const subscriptions = data?.subscriptions || [];
  const payments = data?.payments || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Suscripciones</h1>
        <p className="text-slate-500 text-sm mt-1">
          Métricas de ingresos, estado de suscripciones y pagos de todos los tenants.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <StatCard
          icon={Banknote}
          label="MRR Estimado"
          value={formatCurrency(summary.mrr)}
          subLabel="Ingresos recurrentes mensuales"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Recaudado este mes"
          value={formatCurrency(summary.totalCollectedMonth)}
          subLabel="Pagos aprobados del mes actual"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Activas"
          value={summary.activeCount || 0}
          subLabel="Suscripciones con pago vigente"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Clock}
          label="En Trial"
          value={summary.trialCount || 0}
          subLabel="Período de prueba gratuito"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Suspendidas"
          value={summary.suspendedCount || 0}
          subLabel="Sin pago vigente"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-4">
          <div className="flex gap-6">
            {[
              { key: 'subscriptions', label: `Suscripciones (${subscriptions.length})` },
              { key: 'payments', label: `Pagos Recientes (${payments.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla Suscripciones */}
        {activeTab === 'subscriptions' && (
          <div className="overflow-x-auto">
            {subscriptions.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No hay suscripciones registradas aún.</p>
                <p className="text-xs mt-1 text-slate-300">Aquí aparecerán los tenants y su estado de suscripción.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Empresa</th>
                    <th className="py-3 px-4">Estado Tenant</th>
                    <th className="py-3 px-4">Suscripción</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Vencimiento</th>
                    <th className="py-3 px-4">Último Pago</th>
                    <th className="py-3 px-4 text-right">Total Pagado</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {subscriptions.map((sub) => {
                    const tStatus = statusConfig[sub.tenant_status] || { label: sub.tenant_status, color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
                    const sStatus = statusConfig[sub.subscription_status] || { label: sub.subscription_status, color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
                    const isExpanded = expandedRow === sub.tenant_id;

                    return (
                      <React.Fragment key={sub.tenant_id}>
                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                {sub.tenant_name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{sub.tenant_name}</p>
                                <p className="text-xs text-slate-400">{sub.tenant_slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tStatus.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${tStatus.dot}`} />
                              {tStatus.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sStatus.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sStatus.dot}`} />
                              {sStatus.label || '—'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">{sub.plan_name || '—'}</td>
                          <td className="py-3.5 px-4 text-slate-600">{formatDate(sub.expires_at)}</td>
                          <td className="py-3.5 px-4 text-slate-600">{formatDate(sub.last_payment_date)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatCurrency(sub.total_paid)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : sub.tenant_id)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/80">
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Inicio Suscripción</p>
                                  <p className="font-medium text-slate-700">{formatDate(sub.starts_at)}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Próx. Vencimiento</p>
                                  <p className="font-medium text-slate-700">{formatDate(sub.next_billing_date)}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Precio Plan</p>
                                  <p className="font-medium text-slate-700">{formatCurrency(sub.plan_price)} / mes</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">ID Tenant</p>
                                  <p className="font-mono text-xs text-slate-500 truncate">{sub.tenant_id}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tabla Pagos */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No hay pagos registrados aún.</p>
                <p className="text-xs mt-1 text-slate-300">Aquí aparecerán los pagos recibidos vía MercadoPago.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Empresa</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Monto</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Fecha Aprobación</th>
                    <th className="py-3 px-4">ID Pago MP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {payments.map((pay) => {
                    const pStatus = paymentStatusConfig[pay.status] || { label: pay.status, color: 'bg-slate-100 text-slate-600' };
                    return (
                      <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                              {pay.tenant_name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-medium text-slate-900">{pay.tenant_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{pay.plan_name}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(pay.transaction_amount)}</td>
                        <td className="py-3.5 px-4 uppercase text-xs text-slate-500">{pay.payment_method || 'MercadoPago'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${pStatus.color}`}>
                            {pStatus.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{formatDate(pay.date_approved || pay.created_at)}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{pay.payment_id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
