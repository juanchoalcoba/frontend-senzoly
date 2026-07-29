import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  fetchSubscriptionStatus,
  fetchAvailablePlans,
  createCheckoutPreference,
} from '../services/subscriptionApi';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Receipt,
  Loader2,
  Check,
} from 'lucide-react';

export default function SubscriptionPage() {
  const [searchParams] = useSearchParams();
  const paymentQuery = searchParams.get('payment');

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subDetails, availablePlans] = await Promise.all([
        fetchSubscriptionStatus(),
        fetchAvailablePlans(),
      ]);
      setSubscriptionData(subDetails);
      setPlans(availablePlans);
    } catch (err) {
      console.error('Error al cargar datos de suscripción:', err);
      setError(err.message || 'No se pudieron cargar los datos de suscripción.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setCheckoutLoading(true);
      setError(null);
      const res = await createCheckoutPreference(planId);
      if (res && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        throw new Error('No se recibió la URL de pago de MercadoPago');
      }
    } catch (err) {
      console.error('Error al iniciar Checkout Pro:', err);
      setError(err.message || 'Error al conectar con MercadoPago Checkout Pro');
      setCheckoutLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Suscripción Activa
        </span>
      );
    }
    if (s === 'TRIAL') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" /> Período de Prueba (Trial)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
        <AlertCircle className="w-3.5 h-3.5" /> Suspendida
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Banner de Notificación de MercadoPago */}
        {paymentQuery === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">¡Pago registrado exitosamente!</p>
              <p className="text-xs text-emerald-700">
                Tu suscripción ha sido actualizada mediante MercadoPago. Si tu estado no se refresca inmediatamente, se confirmará automáticamente en unos momentos vía webhook.
              </p>
            </div>
          </div>
        )}

        {paymentQuery === 'pending' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 shadow-sm animate-fade-in">
            <Clock className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Pago en proceso de confirmación</p>
              <p className="text-xs text-amber-700">
                MercadoPago está procesando tu pago. Tu cuenta se activará tan pronto como recibamos la acreditación final.
              </p>
            </div>
          </div>
        )}

        {paymentQuery === 'failure' && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">No se pudo procesar el pago</p>
              <p className="text-xs text-red-700">
                La transacción no fue aprobada. Puedes reintentar seleccionar tu plan para realizar la contratación mediante MercadoPago Checkout Pro.
              </p>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi Suscripción</h1>
            <p className="text-slate-500 text-sm mt-1">
              Administra el plan de tu empresa, vencimientos y pagos mediante MercadoPago.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            {/* Tarjeta de Estado Actual */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado del servicio</span>
                    {getStatusBadge(subscriptionData?.subscription?.status)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Plan Actual: <span className="text-orange-600">{subscriptionData?.subscription?.plan?.name || 'Senzoly SaaS'}</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Alta: <strong>{formatDate(subscriptionData?.subscription?.startsAt)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Vencimiento: <strong>{formatDate(subscriptionData?.subscription?.expiresAt)}</strong></span>
                    </div>
                    {subscriptionData?.subscription?.daysRemaining !== undefined && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Días restantes: <strong>{subscriptionData.subscription.daysRemaining} días</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {subscriptionData?.lastPayment && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 md:w-72 shrink-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Último Pago Registrado</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(subscriptionData.lastPayment.transaction_amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Fecha: {formatDate(subscriptionData.lastPayment.date_approved || subscriptionData.lastPayment.created_at)}
                    </p>
                    <p className="text-xs text-slate-500">ID Pago: {subscriptionData.lastPayment.payment_id}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selector de Planes */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Planes Disponibles</h3>
                <p className="text-sm text-slate-500">Selecciona el plan de tu preferencia para contratar o renovar tu suscripción.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Profesional Destacado */}
                <div className="relative bg-white rounded-2xl border-2 border-orange-500 p-6 shadow-md flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Recomendado
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Plan Profesional</h4>
                    <p className="text-sm text-slate-500 mt-1">Acceso completo e ilimitado para hacer crecer tu negocio.</p>

                    <div className="my-6">
                      <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(plans[0]?.price || 14900)}</span>
                      <span className="text-slate-500 font-medium"> / mes</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {[
                        'Agenda inteligente con visualización diaria/semanal',
                        'Reservas y turnos ilimitados sin comisiones por cliente',
                        'Gestión completa de clientes e historial de atenciones',
                        'Integración nativa con WhatsApp',
                        'Gestión de empleados y comisiones automáticas',
                        'Módulo de Finanzas y reportes de facturación',
                        'Portal Profesional para colaboradores',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plans[0]?.id)}
                    disabled={checkoutLoading}
                    className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirigiendo a MercadoPago...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Contratar con MercadoPago Checkout Pro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Historial de Pagos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Receipt className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900">Historial de Pagos</h3>
              </div>

              {subscriptionData?.history && subscriptionData.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">ID Pago MP</th>
                        <th className="py-3 px-4">Método</th>
                        <th className="py-3 px-4">Monto</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Factura</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {subscriptionData.history.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {formatDate(pay.date_approved || pay.created_at)}
                          </td>
                          <td className="py-3 px-4 text-slate-700">{pay.plan_name || 'Plan Profesional'}</td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600">{pay.payment_id}</td>
                          <td className="py-3 px-4 text-slate-600 uppercase text-xs">{pay.payment_method || 'MercadoPago'}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(pay.transaction_amount)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                pay.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pay.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {pay.status === 'approved' ? 'Aprobado' : pay.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-xs text-slate-400 italic">
                            (Próximamente)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No existen pagos registrados aún.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
