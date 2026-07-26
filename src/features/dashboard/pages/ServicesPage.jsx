import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  getServices, 
  getServiceStats, 
  createService, 
  updateService,
  uploadServiceImage,
  deleteServiceImage,
} from '../services/serviceCatalogApi';
import ServiceImage from '../../../components/ServiceImage';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit2, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  X, 
  Info, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ImagePlus,
  Trash2,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ totalServices: 0, activeServices: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 0,
    isActive: true
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  useEffect(() => () => {
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const token = localStorage.getItem('token');

  const loadData = async () => {
    try {
      setLoading(true);
      const [list, statsData] = await Promise.all([
        getServices(token),
        getServiceStats(token)
      ]);
      setServices(list);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (service = null) => {
    setFormError('');
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        durationMinutes: service.duration_minutes || 30,
        price: service.price || 0,
        isActive: service.is_active ?? true
      });
      setImageFile(null);
      setImagePreview(service.image_url || null);
      setRemoveExistingImage(false);
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        durationMinutes: 30,
        price: 0,
        isActive: true
      });
      setImageFile(null);
      setImagePreview(null);
      setRemoveExistingImage(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
  };

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Selecciona una imagen JPEG, PNG o WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no puede superar los 5 MB.');
      event.target.value = '';
      return;
    }
    setFormError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  };

  const handleImageRemoval = () => {
    if (imageFile) {
      setImageFile(null);
      setImagePreview(editingService?.image_url || null);
      return;
    }
    if (editingService?.image_url) {
      setImagePreview(null);
      setRemoveExistingImage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('El nombre del servicio es obligatorio');
      return;
    }

    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      setFormError('La duración estimada debe ser un número mayor a 0 minutos');
      return;
    }

    if (formData.price === '' || formData.price < 0) {
      setFormError('El precio debe ser un número mayor o igual a 0');
      return;
    }

    setFormLoading(true);

    try {
      let savedService;
      const wasEditing = Boolean(editingService);
      if (wasEditing) {
        savedService = await updateService(token, editingService.id, formData);
      } else {
        savedService = await createService(token, formData);
        setEditingService(savedService);
      }

      try {
        if (imageFile) {
          savedService = await uploadServiceImage(token, savedService.id, imageFile);
        } else if (wasEditing && removeExistingImage) {
          savedService = await deleteServiceImage(token, savedService.id);
        }
      } catch (imageError) {
        setServices(prev => wasEditing
          ? prev.map(s => s.id === savedService.id ? savedService : s)
          : [savedService, ...prev]);
        setFormError(`El servicio se guardó, pero no se pudo procesar la imagen: ${imageError.message}`);
        return;
      }

      setServices(prev => wasEditing
        ? prev.map(s => s.id === savedService.id ? savedService : s)
        : [savedService, ...prev]);
      
      // Actualizar estadísticas
      const updatedStats = await getServiceStats(token);
      setStats(updatedStats);

      closeModal();
    } catch (err) {
      setFormError(err.message || 'Error al guardar el servicio');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const updated = await updateService(token, service.id, {
        isActive: !service.is_active
      });
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      const updatedStats = await getServiceStats(token);
      setStats(updatedStats);
    } catch (err) {
      alert('Error al cambiar el estado del servicio: ' + err.message);
    }
  };

  // Filtrado de servicios
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(search.toLowerCase()));

    if (filterStatus === 'active') return matchesSearch && service.is_active;
    if (filterStatus === 'inactive') return matchesSearch && !service.is_active;
    return matchesSearch;
  });

  const formatPrice = (val) => {
    const num = parseFloat(val) || 0;
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Catálogo de Servicios</h1>
            <p className="text-slate-500 text-sm mt-1">
              Configura los servicios, precios y duraciones ofrecidos por tu negocio.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nuevo Servicio
          </button>
        </div>

        {/* Banner Informativo sobre Reservas Online */}
        <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-4 flex items-start gap-3 text-orange-950 shadow-sm">
          <div className="p-2 bg-orange-100/80 rounded-xl text-orange-600 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-orange-950">Oferta Disponible para Reservas Online</p>
            <p className="text-orange-800/90 mt-0.5">
              Los servicios que mantengas en estado <strong>Activo</strong> estarán disponibles automáticamente para que tus clientes los seleccionen al agendar desde tu Portal Público de Reservas.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total de Servicios</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalServices}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Servicios Activos</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.activeServices}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos ({services.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'active' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Activos ({stats.activeServices})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'inactive' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Inactivos ({stats.totalServices - stats.activeServices})
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-3"></div>
            <p className="text-sm font-medium">Cargando catálogo de servicios...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-white rounded-2xl border border-slate-200/80">
            <p className="font-semibold">Error al cargar servicios</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            <Briefcase className="w-12 h-12 stroke-[1.5] text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No hay servicios registrados</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {search || filterStatus !== 'all'
                ? 'No se encontraron servicios que coincidan con la búsqueda o filtro seleccionado.'
                : 'Haz clic en "Nuevo Servicio" para agregar la primera opción reservable a tu catálogo.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                  service.is_active ? 'border-slate-200/80' : 'border-slate-200 bg-slate-50/40 opacity-75'
                }`}
              >
                <div>
                  <ServiceImage
                    src={service.image_url}
                    alt={`Imagen de ${service.name}`}
                    className="w-full h-36 rounded-xl mb-4"
                  />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {service.name}
                    </h3>
                    <button
                      onClick={() => handleToggleActive(service)}
                      title={service.is_active ? 'Servicio activo (clic para desactivar)' : 'Servicio inactivo (clic para activar)'}
                      className="shrink-0 transition-transform active:scale-95"
                    >
                      {service.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Inactivo
                        </span>
                      )}
                    </button>
                  </div>

                  {service.description ? (
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-4">Sin descripción adicional.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration_minutes} min
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => openModal(service)}
                    className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    title="Editar Servicio"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal de Crear / Editar Servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-900/40 p-4 backdrop-blur-xs sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              className="my-auto flex w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)]"
            >
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="service-modal-title" className="text-base font-bold text-slate-900">
                    {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingService ? 'Modifica los parámetros del servicio' : 'Define una nueva opción reservable'}
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

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Servicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Corte de pelo, Cancha de Pádel, Consulta..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duración (minutos) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="30"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Expresada en minutos</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Precio ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre lo que incluye este servicio o recomendaciones para el cliente..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Imagen del servicio (opcional)</label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleImageRemoval}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {imageFile ? 'Descartar selección' : 'Eliminar imagen'}
                    </button>
                  )}
                </div>
                <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/70 p-3 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Vista previa" className="h-32 w-full rounded-lg object-cover" />
                  ) : (
                    <span className="h-24 flex flex-col items-center justify-center gap-1 text-slate-500 text-xs">
                      <ImagePlus className="w-5 h-5 text-orange-500" />
                      Seleccionar imagen
                    </span>
                  )}
                  <span className="block text-center text-[11px] text-slate-500 mt-2">JPEG, PNG o WebP · máximo 5 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelection} className="sr-only" />
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Disponible para Reservas</span>
                  <span className="text-[11px] text-slate-400 block">
                    {formData.isActive ? 'El servicio estará activo para reservas' : 'El servicio estará oculto para reservas'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Guardando...' : editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>

            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
