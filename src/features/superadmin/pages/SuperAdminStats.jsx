import React, { useEffect, useState } from 'react';
import { getSuperAdminStats } from '../../auth/services/authApi';
import { Building2, Users, Activity, Calendar, CheckCircle, Clock, AlertTriangle, Briefcase } from 'lucide-react';

export default function SuperAdminStats() {
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getSuperAdminStats(token);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const platformState = stats?.platformState?.tenants || {};
  const usersState = stats?.platformState?.users || {};
  const bookingsState = stats?.platformUsage?.bookings || {};

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Estadísticas</h1>
        <p className="text-slate-500">Métricas clave de adopción y uso de la plataforma.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Estado de la Plataforma</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Empresas</h3>
            <p className="text-3xl font-bold text-slate-900">{platformState.total || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Activas</h3>
            <p className="text-3xl font-bold text-slate-900">{platformState.active || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">En Trial</h3>
            <p className="text-3xl font-bold text-slate-900">{platformState.trial || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Suspendidas</h3>
            <p className="text-3xl font-bold text-slate-900">{platformState.suspended || 0}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Uso de la Plataforma</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="text-slate-500 text-sm font-medium">Reservas Totales</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{bookingsState.total || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h3 className="text-slate-500 text-sm font-medium">Reservas Creadas Hoy</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{bookingsState.createdToday || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h3 className="text-slate-500 text-sm font-medium">Clientes</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{usersState.customers || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <h3 className="text-slate-500 text-sm font-medium">Profesionales</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{usersState.professionals || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h3 className="text-slate-500 text-sm font-medium">Usuarios Admin</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{usersState.admins || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
