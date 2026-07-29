import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import {
  getFinancialOverview,
  getFinancialCharts,
  getEmployeeRanking,
  getFinancialMovements,
} from '../services/financeApi';
import { getEmployees } from '../services/employeeApi';
import { getServices } from '../services/serviceCatalogApi';

import FinanceOverviewCards from '../components/finance/FinanceOverviewCards';
import FinanceChart from '../components/finance/FinanceChart';
import EmployeeRankingTable from '../components/finance/EmployeeRankingTable';
import FinanceMovementsTable from '../components/finance/FinanceMovementsTable';
import EmployeeDetailModal from '../components/finance/EmployeeDetailModal';

import { Calendar, RefreshCw, Filter } from 'lucide-react';

export default function FinancePage() {
  const { token } = useAuth();

  // Filtros de fecha
  const [period, setPeriod] = useState('month'); // 'today' | 'week' | 'month' | 'year' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Agrupación para gráfico
  const [chartGrouping, setChartGrouping] = useState('daily');

  // Estados de datos
  const [overviewData, setOverviewData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [movementsData, setMovementsData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  // Filtros de la tabla de movimientos
  const [movementFilters, setMovementFilters] = useState({
    employeeId: '',
    serviceId: '',
    paymentMethod: '',
  });

  // Modal detalle de empleado
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Loadings
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(true);

  // Calcula startDate y endDate según el período elegido
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = today.toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    } else if (period === 'week') {
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = pastWeek.toISOString();
      endDate = now.toISOString();
    } else if (period === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = firstDay.toISOString();
      endDate = now.toISOString();
    } else if (period === 'year') {
      const firstDayYear = new Date(now.getFullYear(), 0, 1);
      startDate = firstDayYear.toISOString();
      endDate = now.toISOString();
    } else if (period === 'custom') {
      if (customStartDate) startDate = new Date(customStartDate).toISOString();
      if (customEndDate) {
        const ed = new Date(customEndDate);
        ed.setHours(23, 59, 59);
        endDate = ed.toISOString();
      }
    }

    return { startDate, endDate };
  }, [period, customStartDate, customEndDate]);

  // Carga catálogos auxiliares (empleados y servicios para dropdowns)
  useEffect(() => {
    if (token) {
      getEmployees(token).then(setEmployeesList).catch(console.error);
      getServices(token).then(setServicesList).catch(console.error);
    }
  }, [token]);

  // Carga datos financieros principales
  const loadFinancialData = useCallback(async () => {
    if (!token) return;

    const { startDate, endDate } = getDateRange();

    // 1. Resumen y KPIs
    setLoadingOverview(true);
    getFinancialOverview(token, { startDate, endDate })
      .then(setOverviewData)
      .catch(console.error)
      .finally(() => setLoadingOverview(false));

    // 2. Gráfico
    setLoadingChart(true);
    getFinancialCharts(token, { startDate, endDate, grouping: chartGrouping })
      .then(setChartData)
      .catch(console.error)
      .finally(() => setLoadingChart(false));

    // 3. Ranking de empleados
    setLoadingRanking(true);
    getEmployeeRanking(token, { startDate, endDate })
      .then(setRankingData)
      .catch(console.error)
      .finally(() => setLoadingRanking(false));

    // 4. Tabla de movimientos
    setLoadingMovements(true);
    getFinancialMovements(token, {
      startDate,
      endDate,
      employeeId: movementFilters.employeeId,
      serviceId: movementFilters.serviceId,
      paymentMethod: movementFilters.paymentMethod,
    })
      .then((res) => setMovementsData(res.movements || []))
      .catch(console.error)
      .finally(() => setLoadingMovements(false));
  }, [token, getDateRange, chartGrouping, movementFilters]);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const { startDate, endDate } = getDateRange();

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header de la Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Módulo Financiero</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Análisis y balance consolidado del negocio a partir de servicios completados
            </p>
          </div>

          {/* Barra de Filtro de Período */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mes' },
              { id: 'year', label: 'Año' },
              { id: 'custom', label: 'Personalizado' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  period === p.id
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}

            <button
              onClick={loadFinancialData}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors ml-1"
              title="Actualizar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inputs de Rango Personalizado */}
        {period === 'custom' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Desde:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Hasta:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {/* 1. Tarjetas de Resumen & KPIs */}
        <FinanceOverviewCards
          overview={overviewData?.overview}
          kpis={overviewData?.kpis}
          loading={loadingOverview}
        />

        {/* 2. Gráfico de Evolución Financiera */}
        <FinanceChart
          data={chartData}
          grouping={chartGrouping}
          onGroupingChange={setChartGrouping}
          loading={loadingChart}
        />

        {/* 3. Ranking de Empleados */}
        <EmployeeRankingTable
          ranking={rankingData}
          onSelectEmployee={(id) => setSelectedEmployeeId(id)}
          loading={loadingRanking}
        />

        {/* 4. Historial de Movimientos Financieros */}
        <FinanceMovementsTable
          movements={movementsData}
          employees={employeesList}
          services={servicesList}
          filters={movementFilters}
          onFilterChange={setMovementFilters}
          loading={loadingMovements}
        />
      </div>

      {/* Modal Detalle de Profesional */}
      {selectedEmployeeId && (
        <EmployeeDetailModal
          employeeId={selectedEmployeeId}
          token={token}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </DashboardLayout>
  );
}
