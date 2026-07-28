import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  deleteSuperAdminTenant,
  getSuperAdminStats,
  getSuperAdminTenant,
  getSuperAdminTenants,
  reactivateSuperAdminTenant,
  suspendSuperAdminTenant,
} from '../../auth/services/authApi';
import { 
  Building2, Users, CreditCard, Activity, 
  Search, Filter, Eye, Power, PowerOff, Trash2,
  Calendar, CheckCircle, Clock, AlertTriangle, Briefcase, CalendarDays
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tenantsData] = await Promise.all([
          getSuperAdminStats(token),
          getSuperAdminTenants(token)
        ]);
        setStats(statsData);
        setTenants(tenantsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) fetchData();
  }, [token]);

  const openTenant = async (tenantId) => {
    try {
      setActionError('');
      setSelectedTenant(await getSuperAdminTenant(token, tenantId));
    } catch (error) {
      setActionError(error.message);
    }
  };

  const changeTenantStatus = async (tenant, action) => {
    const labels = { suspend: 'suspender', reactivate: 'reactivar', delete: 'eliminar' };
    if (!window.confirm(`¿Confirmas que deseas ${labels[action]} ${tenant.name}?`)) return;

    try {
      setActionError('');
      const operations = {
        suspend: suspendSuperAdminTenant,
        reactivate: reactivateSuperAdminTenant,
        delete: deleteSuperAdminTenant,
      };
      const updated = await operations[action](token, tenant.id);
      if (action === 'delete') {
        setTenants((current) => current.filter((item) => item.id !== tenant.id));
        setSelectedTenant(null);
        return;
      }
      setTenants((current) => current.map((item) => (
        item.id === tenant.id ? { ...item, ...updated } : item
      )));
      setSelectedTenant((current) => current?.id === tenant.id ? { ...current, ...updated } : current);
    } catch (error) {
      setActionError(error.message);
    }
  };

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
  const latestTenants = stats?.recentActivity?.latestTenants || [];
  const suspendedTenants = stats?.recentActivity?.suspendedTenants || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.firstName}</h1>
        <p className="text-slate-500">Resumen general de la plataforma Senzoly.</p>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Estado de la Plataforma */}
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

      {/* Uso de la Plataforma */}
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

      {/* Actividad Reciente */}
      <section className="grid lg:grid-cols-2 gap-8">
        {/* Últimas Empresas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Últimas empresas registradas</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <ul className="divide-y divide-slate-100">
              {latestTenants.map(t => (
                <li key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.business_type || 'Sin tipo'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium mb-1">
                      {t.status}
                    </span>
                    <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
              {latestTenants.length === 0 && (
                <li className="p-8 text-center text-slate-500">No hay registros recientes.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Empresas Suspendidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Empresas suspendidas</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <ul className="divide-y divide-slate-100">
              {suspendedTenants.map(t => (
                <li key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.business_type || 'Sin tipo'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium mb-1">
                      {t.status}
                    </span>
                    <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
              {suspendedTenants.length === 0 && (
                <li className="p-8 text-center text-slate-500">No hay empresas suspendidas.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
