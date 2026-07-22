import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getCustomers, updateCustomer, getCustomerStats } from '../services/customerApi';
import { 
  Users, 
  Search, 
  Edit2, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Info, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalCustomers: 0, newThisMonth: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'history'

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  const loadData = async (searchTerm = '') => {
    try {
      setLoading(true);
      const [custList, statsData] = await Promise.all([
        getCustomers(token, searchTerm),
        getCustomerStats(token)
      ]);
      setCustomers(custList);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      notes: customer.notes || ''
    });
    setFormError('');
    setSuccessMessage('');
    setActiveTab('info');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setFormLoading(true);

    try {
      const updated = await updateCustomer(token, selectedCustomer.id, formData);
      setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCustomer(updated);
      setSuccessMessage('Información de cliente guardada correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Error al guardar los cambios.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cartera de Clientes</h1>
            <p className="text-slate-500 text-sm mt-1">
              Consulta, administra y gestiona las notas e información de tus clientes.
            </p>
          </div>
        </div>

        {/* Banner Informativo sobre Portal Público */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-blue-900 shadow-sm">
          <div className="p-2 bg-blue-100/80 rounded-xl text-blue-600 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-blue-950">Registro Automático de Clientes</p>
            <p className="text-blue-700/90 mt-0.5">
              Tus nuevos clientes se crean automáticamente en este panel cuando realizan una reserva en línea a través del Portal Público de Reservas.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total de Clientes</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalCustomers}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Nuevos este Mes</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.newThisMonth}</p>
            </div>
          </div>
        </div>

        {/* Search & Content Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <span className="text-xs text-slate-500">
              Mostrando {customers.length} cliente(s)
            </span>
          </div>

          {/* Customer Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-3"></div>
              <p className="text-sm font-medium">Cargando clientes...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">
              <p className="font-semibold">Error al cargar datos</p>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 stroke-[1.5] text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No se encontraron clientes</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {search 
                  ? 'No hay ningún cliente que coincida con el criterio de búsqueda.'
                  : 'Los clientes registrados en tus reservas públicas aparecerán automáticamente aquí.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3.5 px-6">Cliente</th>
                    <th className="py-3.5 px-6">Contacto</th>
                    <th className="py-3.5 px-6">Fecha Registro</th>
                    <th className="py-3.5 px-6">Notas Internas</th>
                    <th className="py-3.5 px-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 flex items-center justify-center text-orange-700 font-bold text-sm shadow-sm shrink-0">
                            {c.first_name?.[0]?.toUpperCase()}{c.last_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {c.first_name} {c.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div className="space-y-1">
                          {c.email ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Sin correo</span>
                          )}
                          {c.phone ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.phone}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Sin teléfono</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(c.created_at)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 max-w-xs">
                        {c.notes ? (
                          <div className="flex items-start gap-1.5 bg-amber-50/70 border border-amber-100 p-2 rounded-lg text-amber-900 line-clamp-2">
                            <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{c.notes}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sin notas</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => openCustomerModal(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Ficha / Notas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Modal de Ficha & Edición de Cliente */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {selectedCustomer.first_name?.[0]?.toUpperCase()}{selectedCustomer.last_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registrado el {formatDate(selectedCustomer.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-5 bg-white">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'info'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Información y Notas
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'history'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Historial de Reservas
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {activeTab === 'info' ? (
                <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+598 99 000 000"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notas Internas del Negocio
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Preferencias del cliente, indicaciones especiales, alergias, o recordatorios..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400"
                    ></textarea>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Las notas son privadas y solo visibles para ti y tu equipo.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-700 text-sm">Historial de Reservas</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    El historial de citas y servicios consumidos se mostrará aquí automáticamente cuando esté disponible el módulo de **Reservas (Booking)**.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            {activeTab === 'info' && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="customer-form"
                  disabled={formLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
