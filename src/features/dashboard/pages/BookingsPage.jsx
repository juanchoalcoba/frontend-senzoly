import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getBookings, getBookingStats, updateBookingStatus } from '../services/bookingApi';
import {
  Calendar, CheckCircle2, XCircle, Clock, Search, 
  User, Scissors, DollarSign, ChevronDown, AlertCircle, RefreshCw
} from 'lucide-react';

const STATUS_LABELS = {
  CONFIRMED: { label: 'Confirmada', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  PENDING:   { label: 'Pendiente',  color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  COMPLETED: { label: 'Completada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  CANCELED:  { label: 'Cancelada',  color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, todayBookings: 0, completedBookings: 0, canceledBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const [updating, setUpdating] = useState(null);

  const token = localStorage.getItem('token');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingList, statsData] = await Promise.all([
        getBookings(token, { date: filterDate, status: filterStatus, search }),
        getBookingStats(token)
      ]);
      setBookings(bookingList);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterStatus, search]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      const updated = await updateBookingStatus(token, bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === updated.id ? { ...b, status: updated.status } : b));
      const statsData = await getBookingStats(token);
      setStats(statsData);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr.substring(0, 5);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency', currency: 'UYU', maximumFractionDigits: 0
    }).format(parseFloat(val) || 0);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Reservas</h1>
            <p className="text-slate-500 text-sm mt-1">
              Consulta, filtra y gestiona todos los turnos de tu negocio.
            </p>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Reservas</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Reservas Hoy</p>
                <p className="text-2xl font-bold text-slate-900">{stats.todayBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Completadas</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Canceladas</p>
                <p className="text-2xl font-bold text-slate-900">{stats.canceledBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-slate-700"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-slate-700"
          >
            <option value="">Todos los estados</option>
            <option value="CONFIRMED">Confirmadas</option>
            <option value="PENDING">Pendientes</option>
            <option value="COMPLETED">Completadas</option>
            <option value="CANCELED">Canceladas</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-3"></div>
              <p className="text-sm font-medium">Cargando reservas...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="font-semibold text-slate-700">Error al cargar reservas</p>
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center space-y-2 text-slate-400">
              <Calendar className="w-12 h-12 stroke-[1.5] text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No se encontraron reservas</p>
              <p className="text-sm text-slate-500">
                {search || filterDate || filterStatus
                  ? 'Intenta con otros filtros de búsqueda.'
                  : 'Las reservas realizadas en el portal público aparecerán aquí automáticamente.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-3.5 px-5">Cliente</th>
                    <th className="py-3.5 px-5">Servicio</th>
                    <th className="py-3.5 px-5">Fecha y Hora</th>
                    <th className="py-3.5 px-5">Precio</th>
                    <th className="py-3.5 px-5">Estado</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.map((b) => {
                    const statusInfo = STATUS_LABELS[b.status] || STATUS_LABELS.CONFIRMED;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 flex items-center justify-center text-orange-700 font-bold text-xs shrink-0">
                              {b.customer_first_name?.[0]?.toUpperCase()}{b.customer_last_name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{b.customer_first_name} {b.customer_last_name}</p>
                              <p className="text-xs text-slate-400">{b.customer_email || b.customer_phone || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-semibold text-slate-800">{b.service_name}</p>
                          <p className="text-xs text-slate-400">{b.duration_minutes} min</p>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <p className="font-semibold text-slate-800">{formatDate(b.booking_date)}</p>
                          <p className="text-xs text-slate-400">{formatTime(b.start_time)} — {formatTime(b.end_time)}</p>
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-900">
                          {formatPrice(b.total_price)}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          {b.status === 'CANCELED' ? (
                            <span className="text-xs text-slate-400 italic">—</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              {b.status !== 'COMPLETED' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                                  disabled={updating === b.id}
                                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                                >
                                  Completar
                                </button>
                              )}
                              {b.status !== 'CANCELED' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'CANCELED')}
                                  disabled={updating === b.id}
                                  className="px-2.5 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
