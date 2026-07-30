import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, CreditCard, Check, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { fetchAvailablePlans, createCheckoutPreference } from '../../dashboard/services/subscriptionApi';

function formatPrice(price) {
  return '$ ' + Number(price).toLocaleString('es-AR');
}

function billingLabel(period) {
  return period === 'YEARLY' ? ' / año' : ' / mes';
}

export default function TenantSuspendedPage() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAvailablePlans();
        if (!cancelled) setPlans(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error al cargar planes');
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await createCheckoutPreference(planId);
      if (res && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        throw new Error('No se pudo obtener la URL de MercadoPago');
      }
    } catch (err) {
      console.error('Error al iniciar Checkout Pro:', err);
      setError(err.message || 'Error al conectar con MercadoPago Checkout Pro');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Período de Prueba Finalizado"
      subtitle="Para continuar utilizando Senzoly y reactivar tu acceso selecciona un plan."
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <CircleAlert className="mx-auto mb-2 h-7 w-7 text-amber-600" />
          <p className="text-sm font-medium text-amber-900">
            Tu período de prueba ha finalizado. Toda tu información (reservas, clientes, empleados) se encuentra intacta y segura.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 text-center">
            {error}
          </div>
        )}

        {loadingPlans ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="ml-2 text-sm text-slate-500 font-medium">Cargando planes disponibles...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border-2 border-orange-500 bg-white p-6 shadow-lg text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">SaaS</span>
                </div>

                <div className="my-4">
                  <span className="text-3xl font-black text-slate-900">{formatPrice(plan.price)}</span>
                  <span className="text-sm font-semibold text-slate-500">{billingLabel(plan.billing_period)}</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Incluye acceso total a:</p>

                <ul className="space-y-2 mb-6">
                  {plan.max_users !== -1 && (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Hasta {plan.max_users} usuarios</span>
                    </li>
                  )}
                  {plan.max_locations !== -1 && (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Hasta {plan.max_locations} sucursal</span>
                    </li>
                  )}
                  {plan.max_bookings === -1 ? (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Reservas ilimitadas</span>
                    </li>
                  ) : (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Hasta {plan.max_bookings} reservas</span>
                    </li>
                  )}
                  {plan.max_users === -1 && (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Usuarios ilimitados</span>
                    </li>
                  )}
                  {plan.max_locations === -1 && (
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Sucursales ilimitadas</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Agenda inteligente</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Gestión de Clientes</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Integración WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Finanzas y Facturación</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Portal Profesional</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Redirigiendo a MercadoPago...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Contratar {plan.name}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loadingPlans && plans.length === 0 && !error && (
          <p className="text-center text-sm text-slate-500">No hay planes disponibles en este momento.</p>
        )}

        <Link to="/login" className="block text-center text-sm font-medium text-slate-500 hover:text-slate-700 pt-2">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
