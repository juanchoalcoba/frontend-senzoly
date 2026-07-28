import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStaffPortalData, updateStaffBookingStatus } from '../services/staffPortalApi';
import { Clock, Phone, Play, CheckCircle2, Calendar, User, RefreshCw, AlertCircle } from 'lucide-react';

// Formatea 'YYYY-MM-DD' → 'Martes 29 de julio'
const formatBookingDate = (dateStr) => {
  if (!dateStr) return '';
  // Parsear sin conversión de zona horaria
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Agrupa un array de bookings por booking_date
const groupByDate = (bookings) => {
  const groups = {};
  bookings.forEach((b) => {
    const key = b.booking_date ? b.booking_date.slice(0, 10) : 'sin-fecha';
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
};

export default function ProfessionalPortalPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadPortalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resData = await getStaffPortalData(token);
      setData(resData);
    } catch (err) {
      console.error('Error al cargar portal:', err);
      setError(err.message || 'No se pudo acceder al portal del profesional.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadPortalData();
  }, [token]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const confirmMessage = newStatus === 'COMPLETED'
      ? '¿Confirmas que deseas completar este servicio? Se registrará el movimiento financiero.'
      : '¿Deseas iniciar la atención de este servicio?';

    if (!window.confirm(confirmMessage)) return;

    try {
      setUpdatingId(bookingId);
      await updateStaffBookingStatus(token, bookingId, newStatus);
      await loadPortalData();
    } catch (err) {
      alert(err.message || 'Error al actualizar el estado del turno');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400 mb-4"></div>
        <p className="text-slate-400 text-sm">Cargando agenda del profesional...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold mb-2">Acceso No Válido</h1>
        <p className="text-slate-400 max-w-xs text-sm mb-6">
          {error || 'El enlace utilizado es incorrecto o ha sido expirado/regenerado por la empresa.'}
        </p>
      </div>
    );
  }

  const { employee, tenant, bookings } = data;
  const todayDateStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto shadow-2xl">
      {/* Header Mobile */}
      <header className="p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md bg-slate-900/90">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">{tenant.name}</span>
            <h1 className="text-xl font-bold text-white leading-tight">
              Hola, {employee.firstName} 👋
            </h1>
          </div>
          <button 
            onClick={loadPortalData} 
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
            title="Actualizar agenda"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="capitalize">{todayDateStr}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mi Agenda</h2>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2.5 py-0.5 rounded-full">
            {bookings.length} {bookings.length === 1 ? 'turno' : 'turnos'}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800/80 my-6">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="font-medium text-slate-300">¡Todo libre por hoy!</p>
            <p className="text-xs text-slate-500 mt-1">No tienes turnos programados en este momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupByDate(bookings).map(([dateKey, dayBookings]) => (
              <div key={dateKey}>
                {/* Separador de fecha */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1.5 rounded-xl border border-slate-700/50">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-200 capitalize">
                      {formatBookingDate(dateKey)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {dayBookings.length} {dayBookings.length === 1 ? 'turno' : 'turnos'}
                  </span>
                </div>

                <div className="space-y-3">
            {dayBookings.map((booking) => {
              const isUpdating = updatingId === booking.id;
              const cleanPhone = booking.customer_phone ? booking.customer_phone.replace(/[^0-9]/g, '') : null;

              return (
                <div 
                  key={booking.id} 
                  className={`bg-slate-900 rounded-2xl p-5 border transition-all duration-200 ${
                    booking.status === 'IN_PROGRESS' 
                      ? 'border-indigo-500/80 shadow-lg shadow-indigo-500/10 bg-slate-900/90' 
                      : booking.status === 'COMPLETED'
                      ? 'border-emerald-500/30 opacity-75'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Top: Horario y Estado */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-base text-white">
                        {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                      </span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        booking.status === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-300 animate-pulse border border-indigo-500/30' :
                        booking.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        booking.status === 'CANCELED' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {booking.status === 'IN_PROGRESS' ? 'En Curso' :
                         booking.status === 'COMPLETED' ? 'Completado' :
                         booking.status === 'CANCELED' ? 'Cancelado' :
                         'Confirmado'}
                      </span>
                    </div>
                  </div>

                  {/* Detalle Servicio y Cliente */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-100 text-base">{booking.service_name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{booking.duration_minutes} min</p>
                      </div>
                      <span className="font-bold text-emerald-400 text-base">${booking.total_price}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="font-medium">{booking.customer_first_name} {booking.customer_last_name}</span>
                      </div>

                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium transition-colors border border-emerald-500/20"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {booking.notes && (
                      <p className="text-xs bg-slate-950/60 p-2.5 rounded-xl text-slate-400 italic border border-slate-800/50 mt-2">
                        "{booking.notes}"
                      </p>
                    )}
                  </div>

                  {/* Acciones del Profesional */}
                  <div className="pt-1">
                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Iniciar Servicio</span>
                      </button>
                    )}

                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Completar Servicio</span>
                      </button>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <div className="w-full flex items-center justify-center gap-2 py-2 text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Servicio Completado con Éxito</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer Mobile */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-500">
        Portal del Profesional · Senzoly
      </footer>
    </div>
  );
}
