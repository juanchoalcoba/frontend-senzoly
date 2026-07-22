import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getSuperAdminStats, getSuperAdminTenants } from '../../auth/services/authApi';
import { 
  Building2, Users, CreditCard, Activity, 
  Search, Filter, MoreVertical, Eye, Power, PowerOff, Trash2
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const kpis = [
    { name: 'Empresas Registradas', value: stats?.totalTenants || 0, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Suscripciones Activas', value: stats?.activeSubscriptions || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Usuarios Totales', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Ingresos MRR', value: `$${stats?.mrr || 0}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.firstName}</h1>
        <p className="text-slate-500">Resumen general de la plataforma Senzoly.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{kpi.name}</h3>
            <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Empresas (Tenants)</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar empresa..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Empresa</th>
                <th className="px-6 py-4 font-medium">Administrador</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Registro</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{tenant.name}</div>
                    <div className="text-sm text-slate-500">/{tenant.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{tenant.admin_name || 'Sin admin'}</div>
                    <div className="text-xs text-slate-500">{tenant.admin_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {tenant.plan_name || 'Trial'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tenant.subscription_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      tenant.subscription_status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tenant.subscription_status || 'TRIAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver Empresa">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspender">
                        <PowerOff className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {tenants.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No hay empresas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
