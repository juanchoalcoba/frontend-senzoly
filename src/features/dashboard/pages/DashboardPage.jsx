import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { getBookings } from '../services/bookingApi';
import { getCustomers } from '../services/customerApi';
import { getServices } from '../services/serviceCatalogApi';
import {
  Building2,
  CreditCard,
  ShieldCheck,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, tenant, subscription } = useAuth();
  const navigate = useNavigate();

  const [copiedLink, setCopiedLink] = useState(false);
  const [todayBookings, setTodayBookings] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const token = localStorage.getItem('token');

  // Calculates today's YYYY-MM-DD
  const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateDaysLeft = () => {
    if (subscription?.expiresAt) {
      const expires = new Date(subscription.expiresAt);
      const now = new Date();
      const diffDays = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    if (subscription?.startsAt) {
      const start = new Date(subscription.startsAt);
      const expires = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffDays = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const daysLeft = calculateDaysLeft();
  const isPrueba = subscription?.plan?.slug === 'prueba';
  const publicBookingUrl = tenant?.slug ? `${window.location.origin}/reserva/${tenant.slug}` : '';

  const handleCopyLink = () => {
    if (!publicBookingUrl) return;
    navigator.clipboard.writeText(publicBookingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenPublicPage = () => {
    if (!publicBookingUrl) return;
    window.open(publicBookingUrl, '_blank', 'noopener,noreferrer');
  };

  const loadDashboardData = useCallback(async () => {
    if (!token) return;
    setLoadingStats(true);
    try {
      const todayStr = getTodayISO();
      
      // Load today's bookings, total customers, and services catalog in parallel
      const [bookingsData, customersData, servicesData] = await Promise.allSettled([
        getBookings(token, { date: todayStr }),
        getCustomers(token),
        getServices(token),
      ]);

      if (bookingsData.status === 'fulfilled') {
        setTodayBookings(bookingsData.value || []);
      }
      if (customersData.status === 'fulfilled') {
        setCustomersCount((customersData.value || []).length);
      }
      if (servicesData.status === 'fulfilled') {
        setServicesCount((servicesData.value || []).length);
      }
    } catch (err) {
      console.error('Error cargando métricas del dashboard:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Formato elegante de fecha actual
  const todayFormatted = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Centro de Control • {tenant?.name || 'Senzoly'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              ¡Hola, {user?.firstName}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 capitalize">
              {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Negocio Activo
            </span>
          </div>
        </div>

        {/* 🌟 HERO BANNER: Link de Reserva Pública */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tu Portal de Reservas Online</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Recibe reservas automáticas 24/7
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Comparte este enlace directo con tus clientes en WhatsApp o colócalo en el perfil de Instagram de <strong className="text-white font-semibold">{tenant?.name}</strong> para que tus clientes agenden solos.
              </p>
            </div>

            {/* Caja de Acción del Enlace */}
            <div className="bg-slate-950/60 backdrop-blur-xl p-4 rounded-2xl border border-white/15 flex flex-col gap-3 min-w-full sm:min-w-[320px] lg:min-w-[380px] shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-200 px-1 font-semibold">
                <span>URL de tu negocio:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Público
                </span>
              </div>

              {/* Input con URL */}
              <div className="bg-slate-950/80 px-3.5 py-2.5 rounded-xl border border-white/10 text-slate-200 text-xs font-mono truncate select-all">
                {publicBookingUrl || 'Cargando enlace...'}
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    copiedLink
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white text-slate-900 hover:bg-slate-100 shadow-md shadow-white/10'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenPublicPage}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 shrink-0"
                  title="Abrir tu página pública en una nueva pestaña"
                >
                  <span>Ver Mi Página</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 GRID DE MÉTRICAS Y KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Turnos de Hoy */}
          <div
            onClick={() => navigate('/dashboard/bookings')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Turnos de Hoy</span>
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loadingStats ? '...' : todayBookings.length}
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Agendados para el día de hoy</span>
              <ArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>

          {/* Clientes Registrados */}
          <div
            onClick={() => navigate('/dashboard/clientes')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base de Clientes</span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loadingStats ? '...' : customersCount}
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Clientes guardados en cartera</span>
              <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>

          {/* Servicios en Catálogo */}
          <div
            onClick={() => navigate('/dashboard/services')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Servicios Activos</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 group-hover:scale-110 transition-transform">
                <Scissors className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loadingStats ? '...' : servicesCount}
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Catálogo disponible al cliente</span>
              <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>

          {/* Estado de Suscripción */}
          <div
            onClick={() => navigate('/dashboard/mi-suscripcion')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Activo</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-slate-900 tracking-tight truncate">
                {subscription?.plan?.name || 'Cargando...'}
              </p>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
              {isPrueba ? (
                <span className="text-orange-600 font-bold">
                  Quedan {daysLeft} días de prueba
                </span>
              ) : (
                <span>Suscripción activa sin límites</span>
              )}
            </p>
          </div>
        </div>

        {/* ⚡ ACCESOS RÁPIDOS A MÓDULOS (QUICK ACTIONS) */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-orange-500/50 hover:bg-orange-50/30 text-left transition-all group flex flex-col justify-between h-24"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                Ver Agenda de Turnos ↗
              </span>
            </button>

            <button
              onClick={() => navigate('/dashboard/employees')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/30 text-left transition-all group flex flex-col justify-between h-24"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Gestionar Empleados ↗
              </span>
            </button>

            <button
              onClick={() => navigate('/dashboard/services')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-purple-500/50 hover:bg-purple-50/30 text-left transition-all group flex flex-col justify-between h-24"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                Catálogo de Servicios ↗
              </span>
            </button>

            <button
              onClick={() => navigate('/dashboard/finanzas')}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between h-24"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Módulo Financiero ↗
              </span>
            </button>
          </div>
        </div>

        {/* 🕒 CITAS Y TURNOS DE HOY */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Turnos Programados para Hoy</h2>
              <p className="text-xs text-slate-500">Agenda diaria de {tenant?.name}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Ver calendario completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingStats ? (
            <div className="p-8 text-center text-slate-400 text-xs">Cargando turnos de hoy...</div>
          ) : todayBookings.length === 0 ? (
            <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400" />
              <p className="font-bold text-slate-800 text-sm">No hay turnos registrados para hoy</p>
              <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                Los turnos agendados por tus clientes desde la página web o agendados manualmente aparecerán aquí.
              </p>
              <button
                onClick={() => navigate('/dashboard/bookings')}
                className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                + Agendar nuevo turno
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayBookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 font-black text-xs rounded-xl shrink-0">
                      {b.start_time || '00:00'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {b.customer_name || 'Cliente'}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {b.service_name || 'Servicio'} • {b.employee_name || 'Profesional'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase shrink-0 ${
                    b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status === 'COMPLETED' ? 'Completado' : b.status === 'CONFIRMED' ? 'Confirmado' : b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
