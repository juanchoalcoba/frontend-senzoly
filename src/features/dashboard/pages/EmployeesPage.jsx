import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeApi';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit2, Trash2, X, Lock } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const { subscription } = useAuth();
  const token = localStorage.getItem('token');

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees(token);
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openModal = (employee = null) => {
    setFormError('');
    
    // Check limits if creating a new employee
    if (!employee && subscription?.plan) {
      const maxUsers = subscription.plan.maxUsers;
      if (maxUsers !== -1 && (employees.length + 1) >= maxUsers) {
        setIsLimitReached(true);
      } else {
        setIsLimitReached(false);
      }
    } else {
      setIsLimitReached(false);
    }

    if (employee) {
      setEditingEmployee(employee);
      setFormData({ 
        firstName: employee.first_name, 
        lastName: employee.last_name, 
        email: employee.email || '', 
        phone: employee.phone || '' 
      });
    } else {
      setEditingEmployee(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    
    try {
      if (editingEmployee) {
        await updateEmployee(token, editingEmployee.id, formData);
      } else {
        await createEmployee(token, formData);
      }
      await loadEmployees();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await deleteEmployee(token, id);
        await loadEmployees();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (employee) => {
    try {
      await updateEmployee(token, employee.id, { isActive: !employee.is_active });
      await loadEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Empleados</h1>
            <p className="text-slate-500 mt-1">Gestiona el personal de tu negocio</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Empleado
          </button>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Cargando empleados...</div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No tienes empleados registrados aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-sm font-semibold text-slate-600">Nombre</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Contacto</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Estado</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{emp.first_name} {emp.last_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600">{emp.email || '-'}</div>
                        <div className="text-sm text-slate-500">{emp.phone || '-'}</div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleActive(emp)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${emp.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {emp.is_active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => openModal(emp)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {isLimitReached ? 'Límite alcanzado' : (editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isLimitReached ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Mejora tu plan</h3>
                <p className="text-slate-600 mb-6">
                  Tu plan actual ({subscription?.plan?.name}) no permite agregar más empleados.
                  Pásate al plan <span className="font-bold text-orange-600">Equipo</span> para empezar a gestionar a tu personal de forma profesional.
                </p>
                <button 
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {formError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Apellido *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? 'Guardando...' : 'Guardar'}
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
