import React, { useEffect, useState } from 'react';
import { getSuperAdminStats } from '../../auth/services/authApi';

export default function SuperAdminAudit() {
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getSuperAdminStats(token);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching audit data:', error);
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

  const latestTenants = stats?.recentActivity?.latestTenants || [];
  const suspendedTenants = stats?.recentActivity?.suspendedTenants || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Auditoría y Actividad</h1>
        <p className="text-slate-500">Registro de la actividad reciente más importante de la plataforma.</p>
      </div>

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
