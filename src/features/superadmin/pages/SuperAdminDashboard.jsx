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
  Search, Filter, MoreVertical, Eye, Power, PowerOff, Trash2
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

      {actionError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

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
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Actividad</th>
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
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {tenant.business_type_name || 'Sin tipo'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                      tenant.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div>{tenant.bookings_count} reservas · {tenant.customers_count} clientes</div>
                    <div>{tenant.last_login_at ? `Último acceso: ${new Date(tenant.last_login_at).toLocaleDateString()}` : 'Sin accesos'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openTenant(tenant.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver Empresa">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => changeTenantStatus(tenant, tenant.status === 'suspended' ? 'reactivate' : 'suspend')}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={tenant.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                      >
                        {tenant.status === 'suspended' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => changeTenantStatus(tenant, 'delete')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
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
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No hay empresas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setSelectedTenant(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedTenant.name}</h2>
                <p className="text-sm text-slate-500">/{selectedTenant.slug}</p>
              </div>
              <button onClick={() => setSelectedTenant(null)} className="text-sm text-slate-500 hover:text-slate-900">Cerrar</button>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-500">Estado</dt><dd className="font-medium">{selectedTenant.status}</dd></div>
              <div><dt className="text-slate-500">Plan</dt><dd className="font-medium">{selectedTenant.plan_name || 'Sin plan'}</dd></div>
              <div><dt className="text-slate-500">Tipo de cuenta</dt><dd className="font-medium">{selectedTenant.business_type_name}</dd></div>
              <div><dt className="text-slate-500">Registro</dt><dd className="font-medium">{new Date(selectedTenant.created_at).toLocaleDateString()}</dd></div>
              <div><dt className="text-slate-500">Reservas</dt><dd className="font-medium">{selectedTenant.bookings_count}</dd></div>
              <div><dt className="text-slate-500">Clientes</dt><dd className="font-medium">{selectedTenant.customers_count}</dd></div>
              <div className="col-span-2"><dt className="text-slate-500">Último acceso</dt><dd className="font-medium">{selectedTenant.last_login_at ? new Date(selectedTenant.last_login_at).toLocaleString() : 'Sin accesos registrados'}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
