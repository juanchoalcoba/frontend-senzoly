import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  Crown,
  Loader2,
  AlertCircle,
  Building2,
  Users,
  MapPin,
  Clock,
} from 'lucide-react';
import { getSuperAdminPlans, reactivateSuperAdminTenant } from '../../auth/services/authApi';

const DEFAULT_PLANS = [
  {
    id: '018e6e58-3d2c-7b00-8000-000000000002',
    name: 'Individual',
    slug: 'solo',
    price: 890,
    max_users: 1,
    max_locations: 1,
    max_bookings: -1,
    badge: 'Básico',
    description: 'Ideal para profesionales autónomos o consultorios individuales.',
    icon: Zap,
    accentColor: 'indigo',
  },
  {
    id: '018e6e58-3d2c-7b00-8000-000000000003',
    name: 'Equipo',
    slug: 'equipo',
    price: 1490,
    max_users: 5,
    max_locations: 3,
    max_bookings: -1,
    badge: 'Popular',
    description: 'Para empresas en crecimiento con hasta 5 profesionales.',
    icon: Sparkles,
    accentColor: 'emerald',
  },
  {
    id: '018e6e58-3d2c-7b00-8000-000000000004',
    name: 'Pro+',
    slug: 'pro-plus',
    price: 3200,
    max_users: -1,
    max_locations: -1,
    max_bookings: -1,
    badge: 'Ilimitado',
    description: 'Para grandes centros o franquicias con necesidades completas.',
    icon: Crown,
    accentColor: 'amber',
  },
];

const DURATION_OPTIONS = [
  { days: 30, label: '30 días (1 mes)', sublabel: 'Estándar' },
  { days: 60, label: '60 días (2 meses)', sublabel: 'Bimestral' },
  { days: 90, label: '90 días (3 meses)', sublabel: 'Trimestral' },
  { days: 365, label: '365 días (1 año)', sublabel: 'Anual' },
];

export default function ReactivateTenantModal({ tenant, isOpen, onClose, onSuccess }) {
  const token = localStorage.getItem('token');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setError('');
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const data = await getSuperAdminPlans(token);
        // Filtrar solo los 3 planes comerciales de pago activos
        const paidPlans = (data || []).filter((p) => p.is_active && Number(p.price) > 0);
        if (paidPlans.length > 0) {
          setPlans(paidPlans);
          // Pre-seleccionar el plan que tenía el tenant o el primero
          const currentPlan = paidPlans.find(
            (p) => p.id === tenant?.plan_id || p.slug === tenant?.plan_slug || p.name === tenant?.plan_name
          );
          setSelectedPlanId(currentPlan ? currentPlan.id : paidPlans[0].id);
        } else {
          setPlans(DEFAULT_PLANS);
          setSelectedPlanId(DEFAULT_PLANS[0].id);
        }
      } catch (err) {
        console.error('Error cargando planes, usando predeterminados:', err);
        setPlans(DEFAULT_PLANS);
        setSelectedPlanId(DEFAULT_PLANS[0].id);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [isOpen, tenant, token]);

  if (!isOpen || !tenant) return null;

  const handleReactivate = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const updatedTenant = await reactivateSuperAdminTenant(token, tenant.id, {
        planId: selectedPlanId,
        durationDays: Number(durationDays),
      });

      if (onSuccess) {
        onSuccess(updatedTenant);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error al reactivar la empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con Badge de Reactivación */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Reactivar Empresa</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  Suspendida
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Selecciona el plan que se asignará a <span className="font-semibold text-slate-800">{tenant.name}</span> (/{tenant.slug})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Selección de los 3 Planes */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Elegir Plan a Activar
            </label>
            <span className="text-xs text-slate-400">3 planes comerciales disponibles</span>
          </div>

          {loadingPlans ? (
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                const isCurrent = tenant.plan_name && tenant.plan_name.toLowerCase() === p.name.toLowerCase();

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Badge destacado */}
                    {isCurrent && (
                      <span className="absolute -top-2.5 right-3 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Plan previo
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 text-base">{p.name}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-xl font-extrabold text-slate-900">
                          ${Number(p.price).toLocaleString('es-UY')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">/ mes</span>
                      </div>

                      {/* Características / Límites */}
                      <ul className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                        <li className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>
                            {p.max_users === -1 || p.max_users === '-1'
                              ? 'Usuarios ilimitados'
                              : `${p.max_users} usuario${p.max_users > 1 ? 's' : ''}`}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>
                            {p.max_locations === -1 || p.max_locations === '-1'
                              ? 'Sucursales ilimitadas'
                              : `${p.max_locations} sucursal${p.max_locations > 1 ? 'es' : ''}`}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Reservas ilimitadas</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selección de Duración / Período */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Período de Vigencia de la Reactivación
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = durationDays === opt.days;
              return (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setDurationDays(opt.days)}
                  className={`px-3 py-2.5 rounded-xl text-left border text-xs transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{opt.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opt.sublabel}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen Informativo */}
        <div className="mt-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 text-xs text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-semibold text-emerald-950">
              Impacto inmediato de la reactivación:
            </p>
            <p className="text-emerald-800">
              La cuenta pasará al estado <span className="font-bold">Activo</span> con el plan{' '}
              <span className="font-bold">{selectedPlan?.name || 'Seleccionado'}</span> por los próximos{' '}
              <span className="font-bold">{durationDays} días</span>. Sus usuarios podrán iniciar sesión y
              operar normalmente sin ser bloqueados.
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleReactivate}
            disabled={isSubmitting || !selectedPlanId}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reactivando empresa...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Reactivar con Plan {selectedPlan?.name || ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
