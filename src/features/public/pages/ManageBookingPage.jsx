import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingByManageToken, cancelBookingByManageToken } from '../services/publicApi';
import { Calendar, Clock, MapPin, User, Scissors, CheckCircle, XCircle, MessageCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ManageBookingPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchBookingInfo();
  }, [token]);

  const fetchBookingInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBookingByManageToken(token);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'No se pudo encontrar la reserva o el enlace ha caducado.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const updated = await cancelBookingByManageToken(token, reason);
      setBooking(prev => ({ ...prev, status: 'CANCELED', canceled_at: updated.canceled_at }));
      setCancelSuccess(true);
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Error al cancelar la reserva');
    } finally {
      setCanceling(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!booking || !booking.tenant_phone) return '#';
    const cleanPhone = booking.tenant_phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${booking.tenant_name}, tengo una consulta sobre mi reserva de ${booking.service_name} el día ${booking.booking_date} a las ${booking.start_time.substring(0, 5)} hs.`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando detalles de tu reserva...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Enlace no válido</h2>
          <p className="text-slate-400 mb-6">{error || 'La reserva solicitada no existe.'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const isCanceled = booking.status === 'CANCELED';
  const isCompleted = booking.status === 'COMPLETED';
  const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">

        {/* Encabezado del Negocio */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            {booking.tenant_name}
          </h1>
          <p className="text-slate-400 text-sm">Gestión de Reserva</p>
        </div>

        {/* Alerta de Éxito al Cancelar */}
        {cancelSuccess && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">
              Tu reserva ha sido cancelada exitosamente y el horario quedó liberado.
            </p>
          </div>
        )}

        {/* Tarjeta Principal de Reserva */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

          {/* Badge de Estado */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-700">
            <span className="text-slate-400 text-sm font-medium">Estado de tu cita:</span>
            {isConfirmed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5" /> Confirmada
              </span>
            )}
            {isCanceled && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" /> Cancelada
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <CheckCircle className="w-3.5 h-3.5" /> Completada
              </span>
            )}
          </div>

          {/* Detalles del Turno */}
          <div className="space-y-4 text-slate-300">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Servicio</p>
                <p className="font-semibold text-white">{booking.service_name} ({booking.duration_minutes} min)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Fecha</p>
                <p className="font-semibold text-white">{booking.booking_date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Horario</p>
                <p className="font-semibold text-white">{booking.start_time?.substring(0, 5)} hs</p>
              </div>
            </div>

            {booking.employee_first_name && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Profesional</p>
                  <p className="font-semibold text-white">{booking.employee_first_name} {booking.employee_last_name}</p>
                </div>
              </div>
            )}

            {booking.tenant_address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Ubicación</p>
                  <p className="font-semibold text-white">{booking.tenant_address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="pt-6 border-t border-slate-700 space-y-3">
            {isConfirmed && (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <XCircle className="w-5 h-5" /> Cancelar Reserva
              </button>
            )}

            {booking.tenant_phone && (
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
              </a>
            )}

            <button
              onClick={() => navigate(`/reserva/${booking.tenant_slug}`)}
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-2xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Reservar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Cancelación */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">¿Confirmar Cancelación?</h3>
            <p className="text-slate-300 text-sm mb-4">
              ¿Estás seguro de que deseas cancelar tu turno para el <strong className="text-white">{booking.booking_date} a las {booking.start_time?.substring(0, 5)} hs</strong>? Esta acción liberará el cupo en la agenda.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Motivo opcional de la cancelación:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Imprevisto personal"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={canceling}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition"
              >
                Volver
              </button>
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                {canceling ? 'Cancelando...' : 'Sí, Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
