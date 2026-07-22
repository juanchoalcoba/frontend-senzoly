import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  getTenantProfile, 
  updateTenantProfile, 
  getBusinessHours, 
  updateBusinessHours 
} from '../services/settingsApi';
import { 
  Settings, 
  Building2, 
  Clock, 
  Phone, 
  MapPin, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Globe, 
  Info 
} from 'lucide-react';

const DAYS_MAP = [
  { dayOfWeek: 1, name: 'Lunes' },
  { dayOfWeek: 2, name: 'Martes' },
  { dayOfWeek: 3, name: 'Miércoles' },
  { dayOfWeek: 4, name: 'Jueves' },
  { dayOfWeek: 5, name: 'Viernes' },
  { dayOfWeek: 6, name: 'Sábado' },
  { dayOfWeek: 0, name: 'Domingo' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'hours'

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    slug: '',
    phone: '',
    address: '',
    description: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Hours State
  const [hours, setHours] = useState([]);
  const [hoursLoading, setHoursLoading] = useState(true);
  const [hoursSaving, setHoursSaving] = useState(false);
  const [hoursMessage, setHoursMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const token = localStorage.getItem('token');

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await getTenantProfile(token);
      setProfile({
        name: data.name || '',
        slug: data.slug || '',
        phone: data.phone || '',
        address: data.address || '',
        description: data.description || ''
      });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const loadHours = async () => {
    try {
      setHoursLoading(true);
      const data = await getBusinessHours(token);
      
      // Mapear respuesta asegurando formato HH:MM para los inputs
      const formatted = data.map(h => ({
        dayOfWeek: h.day_of_week,
        openTime: h.open_time ? h.open_time.substring(0, 5) : '09:00',
        closeTime: h.close_time ? h.close_time.substring(0, 5) : '19:00',
        isClosed: Boolean(h.is_closed)
      }));
      setHours(formatted);
    } catch (err) {
      setHoursMessage({ type: 'error', text: err.message });
    } finally {
      setHoursLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadHours();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileSaving(true);

    try {
      const updated = await updateTenantProfile(token, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        description: profile.description
      });
      setProfile(prev => ({ ...prev, ...updated }));
      setProfileMessage({ type: 'success', text: 'Perfil comercial actualizado correctamente.' });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Error al actualizar perfil' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleHoursSubmit = async (e) => {
    e.preventDefault();
    setHoursMessage(null);

    // Validación preventiva en cliente
    for (const h of hours) {
      if (!h.isClosed && h.openTime >= h.closeTime) {
        const dayObj = DAYS_MAP.find(d => d.dayOfWeek === h.dayOfWeek);
        setHoursMessage({
          type: 'error',
          text: `En ${dayObj?.name || 'un día abierto'}, la hora de apertura debe ser anterior a la de cierre.`
        });
        return;
      }
    }

    setHoursSaving(true);

    try {
      const payload = hours.map(h => ({
        dayOfWeek: h.dayOfWeek,
        openTime: `${h.openTime}:00`,
        closeTime: `${h.closeTime}:00`,
        isClosed: h.isClosed
      }));

      const updated = await updateBusinessHours(token, payload);
      const formatted = updated.map(h => ({
        dayOfWeek: h.day_of_week,
        openTime: h.open_time ? h.open_time.substring(0, 5) : '09:00',
        closeTime: h.close_time ? h.close_time.substring(0, 5) : '19:00',
        isClosed: Boolean(h.is_closed)
      }));
      setHours(formatted);

      setHoursMessage({ type: 'success', text: 'Horario general de atención guardado correctamente.' });
      setTimeout(() => setHoursMessage(null), 3000);
    } catch (err) {
      setHoursMessage({ type: 'error', text: err.message || 'Error al guardar horarios' });
    } finally {
      setHoursSaving(false);
    }
  };

  const updateDayHour = (dayOfWeek, field, value) => {
    setHours(prev =>
      prev.map(h => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración del Negocio</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona la información pública de tu negocio y el horario general de atención.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Perfil Comercial
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'hours'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Horario General de Atención
          </button>
        </div>

        {/* TAB 1: PERFIL COMERCIAL */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* Referencia Visual del Enlace Público */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  Portal Público de Reservas (Referencia Visual)
                </div>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  Próximamente
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Enlace único comercial que compartirás con tus clientes:
                </p>
                <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-700/60 font-mono text-sm text-orange-300 overflow-x-auto">
                  <ExternalLink className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>https://senzoly.com/reserva/{profile.slug || 'mi-negocio'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Este enlace se activará automáticamente al habilitar el módulo de Reservas en línea.
                </span>
              </p>
            </div>

            {/* Formulario de Perfil */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              {profileLoading ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-2"></div>
                  <p className="text-sm">Cargando perfil comercial...</p>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  
                  {profileMessage && (
                    <div
                      className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                        profileMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}
                    >
                      {profileMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{profileMessage.text}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Comercial del Negocio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono Comercial de Contacto
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="+598 99 000 000"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Dirección Física
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Av. 18 de Julio 1234, Montevideo"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Descripción del Negocio
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve reseña sobre tu negocio, especialidades y servicios para tus clientes..."
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {profileSaving ? 'Guardando...' : 'Guardar Perfil'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: HORARIO GENERAL DE ATENCIÓN */}
        {activeTab === 'hours' && (
          <div className="space-y-6">

            <div className="bg-slate-100/70 border border-slate-200/60 rounded-2xl p-4 flex items-start gap-3 text-slate-700 text-xs">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                Define los <strong>horarios de apertura y cierre generales</strong> de tu empresa. Los días marcados como cerrados no estarán disponibles para la generación de franjas horarias de reserva.
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              {hoursLoading ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-2"></div>
                  <p className="text-sm">Cargando horario general...</p>
                </div>
              ) : (
                <form onSubmit={handleHoursSubmit} className="space-y-4">

                  {hoursMessage && (
                    <div
                      className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                        hoursMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}
                    >
                      {hoursMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{hoursMessage.text}</span>
                    </div>
                  )}

                  <div className="divide-y divide-slate-100">
                    {DAYS_MAP.map((d) => {
                      const dayHour = hours.find(h => h.dayOfWeek === d.dayOfWeek) || {
                        dayOfWeek: d.dayOfWeek,
                        openTime: '09:00',
                        closeTime: '19:00',
                        isClosed: false
                      };

                      return (
                        <div
                          key={d.dayOfWeek}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 w-36">
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input
                                type="checkbox"
                                checked={!dayHour.isClosed}
                                onChange={(e) => updateDayHour(d.dayOfWeek, 'isClosed', !e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                            <span className={`text-sm font-semibold ${dayHour.isClosed ? 'text-slate-400' : 'text-slate-900'}`}>
                              {d.name}
                            </span>
                          </div>

                          {dayHour.isClosed ? (
                            <span className="text-xs text-slate-400 italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              Cerrado todo el día
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500">Apertura:</span>
                                <input
                                  type="time"
                                  required
                                  value={dayHour.openTime}
                                  onChange={(e) => updateDayHour(d.dayOfWeek, 'openTime', e.target.value)}
                                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
                                />
                              </div>

                              <span className="text-slate-400 text-xs">—</span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500">Cierre:</span>
                                <input
                                  type="time"
                                  required
                                  value={dayHour.closeTime}
                                  onChange={(e) => updateDayHour(d.dayOfWeek, 'closeTime', e.target.value)}
                                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={hoursSaving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {hoursSaving ? 'Guardando Horarios...' : 'Guardar Horario General'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
