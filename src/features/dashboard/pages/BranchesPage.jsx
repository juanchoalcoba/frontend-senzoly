import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  uploadBranchImage,
  deleteBranchImage,
} from '../services/branchApi';
import { getEmployees } from '../services/employeeApi';
import { getServices } from '../services/serviceCatalogApi';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  X,
  Lock,
  Camera,
  MapPin,
  Phone,
  Users,
  Scissors,
  CheckCircle2,
  Star,
  Sparkles,
} from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    isActive: true,
    employeeIds: [],
    serviceIds: [],
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const { subscription } = useAuth();
  const token = localStorage.getItem('token');

  const loadBranchesData = async () => {
    try {
      setLoading(true);
      const [branchesData, employeesData, servicesData] = await Promise.all([
        getBranches(token),
        getEmployees(token),
        getServices(token),
      ]);
      setBranches(branchesData || []);
      setEmployees(employeesData || []);
      setServices(servicesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranchesData();
  }, []);

  const openModal = (branch = null) => {
    setFormError('');
    setImageFile(null);
    setImagePreview(branch?.image_url || null);

    // Check plan limit for multi-branch
    if (!branch && subscription?.plan) {
      const maxLocations = subscription.plan.maxLocations;
      const isTrial = subscription.plan.slug === 'prueba';
      const isProPlus = subscription.plan.slug === 'pro-plus';
      
      // Permitir si es prueba o pro-plus (maxLocations === -1), de lo contrario bloquear si ya existe 1 sucursal
      if (!isTrial && !isProPlus && maxLocations !== -1 && branches.length >= maxLocations) {
        setIsLimitReached(true);
      } else {
        setIsLimitReached(false);
      }
    } else {
      setIsLimitReached(false);
    }

    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        isActive: branch.is_active ?? true,
        employeeIds: branch.employee_ids || [],
        serviceIds: branch.service_ids || [],
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        isActive: true,
        employeeIds: employees.map((e) => e.id),
        serviceIds: services.map((s) => s.id),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La foto no puede superar los 5 MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = async () => {
    if (editingBranch && editingBranch.image_url) {
      try {
        await deleteBranchImage(token, editingBranch.id);
        setEditingBranch({ ...editingBranch, image_url: null });
      } catch (err) {
        console.error('Error al eliminar foto:', err);
      }
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      let savedBranch;
      if (editingBranch) {
        savedBranch = await updateBranch(token, editingBranch.id, formData);
      } else {
        savedBranch = await createBranch(token, formData);
      }

      if (imageFile && savedBranch?.id) {
        await uploadBranchImage(token, savedBranch.id, imageFile);
      }

      await loadBranchesData();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        await deleteBranch(token, id);
        await loadBranchesData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (branch) => {
    try {
      await updateBranch(token, branch.id, { isActive: !branch.is_active });
      await loadBranchesData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Multi-Sede • Gestión de Sucursales</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sucursales</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Administra las sedes físicas de tu negocio, sus fotografías y los servicios/profesionales de cada lugar.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-orange-600/20 text-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Sucursal</span>
          </button>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Grid de Sucursales */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Cargando sucursales...</div>
        ) : branches.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No hay sucursales registradas</h3>
            <p className="text-slate-500 text-xs mt-1">Crea tu primera sede para comenzar a gestionar ubicaciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Imagen de la sucursal */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  {b.image_url ? (
                    <img
                      src={b.image_url}
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 flex flex-col items-center justify-center text-slate-400">
                      <Building2 className="w-10 h-10 text-slate-600 mb-1" />
                      <span className="text-[11px] font-medium text-slate-500">Sin foto cargada</span>
                    </div>
                  )}

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {b.is_main && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Sede Principal
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(b)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md transition-colors ${
                        b.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {b.is_active ? 'Activa' : 'Inactiva'}
                    </button>
                  </div>
                </div>

                {/* Info de la sucursal */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg truncate">{b.name}</h3>
                    {b.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{b.address}</span>
                      </p>
                    )}
                    {b.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{b.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Estadísticas asignadas */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{b.employees_count || 0}</p>
                        <p className="text-[10px] text-slate-500">Profesionales</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Scissors className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{b.services_count || 0}</p>
                        <p className="text-[10px] text-slate-500">Servicios</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones de pie */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => openModal(b)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Sede</span>
                  </button>

                  {!b.is_main && (
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                      title="Eliminar sucursal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nueva / Editar Sucursal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header Fijo */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {isLimitReached ? 'Límite alcanzado' : (editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLimitReached ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Mejora tu plan a PRO+</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Tu plan actual permite administrar 1 sola sucursal. Para gestionar múltiples sedes físicas de tu empresa, actualiza tu suscripción al plan **PRO+**.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors text-xs"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
                      {formError}
                    </div>
                  )}

                  {/* Carga de Foto de la Sucursal */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Foto de la Sede
                    </label>
                    <div className="relative rounded-2xl h-36 bg-slate-900 border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Sede" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                            title="Quitar foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-orange-500 transition-colors">
                          <Camera className="w-8 h-8 mb-1" />
                          <span className="text-xs font-bold">Subir foto de la sede</span>
                          <span className="text-[10px] text-slate-500">JPG, PNG o WebP (máx. 5MB)</span>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombre de la Sucursal *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sucursal Centro, Sucursal Nordelta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Dirección y Teléfono */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Av. Corrientes 1234"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. +54 11 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Profesionales Asignados */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Profesionales Asignados a esta Sede
                    </label>
                    {employees.length === 0 ? (
                      <p className="p-3 text-xs text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                        No hay empleados registrados aún.
                      </p>
                    ) : (
                      <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/50">
                        {employees.map((emp) => (
                          <label
                            key={emp.id}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer hover:bg-slate-100"
                          >
                            <input
                              type="checkbox"
                              checked={formData.employeeIds.includes(emp.id)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  employeeIds: e.target.checked
                                    ? [...formData.employeeIds, emp.id]
                                    : formData.employeeIds.filter((id) => id !== emp.id),
                                })
                              }
                              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="font-semibold">{emp.first_name} {emp.last_name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Servicios Asignados */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Servicios Disponibles en esta Sede
                    </label>
                    {services.length === 0 ? (
                      <p className="p-3 text-xs text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                        No hay servicios en catálogo aún.
                      </p>
                    ) : (
                      <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/50">
                        {services.map((srv) => (
                          <label
                            key={srv.id}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer hover:bg-slate-100"
                          >
                            <input
                              type="checkbox"
                              checked={formData.serviceIds.includes(srv.id)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  serviceIds: e.target.checked
                                    ? [...formData.serviceIds, srv.id]
                                    : formData.serviceIds.filter((id) => id !== srv.id),
                                })
                              }
                              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="font-semibold">{srv.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Fijo */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? 'Guardando...' : 'Guardar Sucursal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
