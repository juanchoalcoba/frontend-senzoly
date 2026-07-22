import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { Building2, CreditCard, ShieldCheck, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user, tenant, subscription } = useAuth();

  const calculateDaysLeft = () => {
    // Primero usamos expires_at que viene del backend (fuente de verdad)
    if (subscription?.expiresAt) {
      const expires = new Date(subscription.expiresAt);
      const now = new Date();
      const diffDays = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    // Fallback: si expires_at es null (cuentas antiguas), calculamos desde starts_at
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            ¡Hola, {user?.firstName}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Aquí tienes un resumen de la información de tu cuenta.
          </p>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tenant Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Mi Negocio</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-500">Nombre</p>
                <p className="font-medium text-slate-900">{tenant?.name || 'Cargando...'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Identificador (Slug)</p>
                <p className="font-medium text-slate-900">@{tenant?.slug || '...'}</p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Suscripción</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-500 flex items-center justify-between">
                  Plan Actual
                  {isPrueba && (
                    <span className="flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      <Clock className="w-3 h-3" />
                      Quedan {daysLeft} días
                    </span>
                  )}
                </p>
                <p className="font-medium text-slate-900 mt-1">
                  {subscription?.plan?.name || 'Cargando...'} 
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${subscription?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {subscription?.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Límites</p>
                <p className="text-sm font-medium text-slate-700">
                  {subscription?.plan?.maxUsers === -1 ? 'Usuarios ilimitados' : `${subscription?.plan?.maxUsers} usuario(s)`}
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {subscription?.plan?.maxBookings === -1 ? 'Reservas ilimitadas' : `Hasta ${subscription?.plan?.maxBookings} reservas`}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Mi Perfil</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-500">Nombre</p>
                <p className="font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Rol en el sistema</p>
                <p className="font-medium text-slate-900">{user?.role === 'OWNER' ? 'Propietario' : user?.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for future features */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center mt-4">
          <img 
            src="https://illustrations.popsy.co/amber/keynote-presentation.svg" 
            alt="Work in progress" 
            className="w-48 mx-auto mb-6 opacity-80"
          />
          <h3 className="text-xl font-bold text-slate-900 mb-2">¡Tu cuenta está lista!</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Hemos preparado el panel de administración. Muy pronto habilitaremos la gestión de empleados y reservas.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
