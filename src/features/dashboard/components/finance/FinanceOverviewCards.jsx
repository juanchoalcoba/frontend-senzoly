import React from 'react';
import { DollarSign, TrendingUp, Users, CheckCircle2, Award, Star, CreditCard, CalendarDays, MinusCircle } from 'lucide-react';

export default function FinanceOverviewCards({ overview, kpis, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-28 flex flex-col justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-7 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const cards = [
    {
      title: 'Ingresos Brutos',
      value: formatMoney(overview?.grossTotal),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      description: 'Facturación total cobrada',
    },
    {
      title: 'Egresos Totales',
      value: formatMoney(overview?.expensesTotal),
      icon: MinusCircle,
      color: 'bg-red-50 text-red-600 border-red-100',
      description: 'Gastos operativos del período',
    },
    {
      title: (overview?.netTotal || 0) < 0 ? 'Resultado Neto' : 'Ingresos Netos',
      value: formatMoney(overview?.netTotal),
      icon: TrendingUp,
      color: (overview?.netTotal || 0) < 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100',
      description: (overview?.netTotal || 0) < 0 ? 'Déficit acumulado del período' : 'Ganancia limpia del negocio',
    },
    {
      title: 'Pagos a Empleados',
      value: formatMoney(overview?.payoutTotal),
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      description: 'Comisiones y pagos al staff',
    },
    {
      title: 'Servicios Completados',
      value: overview?.completedServicesCount || 0,
      icon: CheckCircle2,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      description: 'Turnos atendidos en el período',
    },
    {
      title: 'Ticket Promedio',
      value: formatMoney(overview?.avgTicket),
      icon: Award,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      description: 'Valor medio por servicio',
    },
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* 6 Tarjetas Principales de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* KPI Highlights Bar */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Empleado Destacado */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Top Profesional</span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {kpis.topEmployee?.name || 'Sin datos'}
              </p>
              {kpis.topEmployee && (
                <p className="text-xs text-amber-700 font-medium">Generó {formatMoney(kpis.topEmployee.total)}</p>
              )}
            </div>
          </div>

          {/* Servicio Más Vendido */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-200/60 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Servicio Top</span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {kpis.topService?.name || 'Sin datos'}
              </p>
              {kpis.topService && (
                <p className="text-xs text-indigo-700 font-medium">{kpis.topService.count} realizaciones</p>
              )}
            </div>
          </div>

          {/* Método de Pago Preferido */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Método de Pago Top</span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {kpis.topPaymentMethod?.method || 'Efectivo'}
              </p>
              {kpis.topPaymentMethod && (
                <p className="text-xs text-emerald-700 font-medium">{kpis.topPaymentMethod.count} operaciones</p>
              )}
            </div>
          </div>

          {/* Ingresos Hoy y Mes */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-orange-400 border border-slate-700 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acumulado Neto</span>
              <p className="font-bold text-white text-sm">
                Hoy: {formatMoney(kpis.revenueToday)}
              </p>
              <p className="text-xs text-orange-400 font-semibold">
                Mes: {formatMoney(kpis.revenueMonth)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
