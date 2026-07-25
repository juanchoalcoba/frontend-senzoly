import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Loader2, Globe, Clock, Briefcase } from 'lucide-react';
import { fetchBusinessTypes, registerCompany } from '../services/authApi';
import { useTheme } from '../../../context/ThemeContext';
import { getBusinessTheme } from '../../../theme/businessThemes';

export default function RegisterForm() {
  const { setRouteThemeSlug } = useTheme();
  const [businessTypes, setBusinessTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    businessTypeId: '',
    country: 'Uruguay', // default
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const selectedBusinessType = businessTypes.find(
    (businessType) => businessType.id === formData.businessTypeId
  );
  const previewTheme = getBusinessTheme(selectedBusinessType?.slug);

  useEffect(() => {
    fetchBusinessTypes()
      .then(data => setBusinessTypes(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoadingTypes(false));
  }, []);

  useEffect(() => {
    setRouteThemeSlug(selectedBusinessType?.slug || null);

    return () => setRouteThemeSlug(null);
  }, [selectedBusinessType?.slug, setRouteThemeSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Revísalas e inténtalo nuevamente.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        company: {
          name: formData.companyName,
          businessTypeId: formData.businessTypeId,
          country: formData.country
        },
        owner: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms
        }
      };

      await registerCompany(payload);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">¡Revisa tu correo!</h3>
        <p className="text-slate-600 mb-6">
          Hemos enviado un enlace de confirmación a <strong>{formData.email}</strong>. 
          Haz clic en él para activar tu cuenta.
        </p>
        <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {/* --- SECCIÓN EMPRESA --- */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-orange-500" />
          Datos de la Empresa
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de tu negocio</label>
          <input 
            type="text" required
            className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
            placeholder="Ej: Barbería Juan"
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rubro principal</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-slate-400" />
            </div>
            <select
              required
              disabled={isLoadingTypes}
              className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm appearance-none"
              value={formData.businessTypeId}
              onChange={(e) => setFormData({...formData, businessTypeId: e.target.value})}
            >
              <option value="">{isLoadingTypes ? 'Cargando rubros...' : 'Selecciona tu rubro'}</option>
              {businessTypes.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedBusinessType && (
          <div
            className="theme-preview border rounded-xl p-4 flex items-center gap-3 transition-colors"
            style={{
              '--preview-primary-soft': previewTheme.primarySoft,
              '--preview-primary-muted': previewTheme.primaryMuted,
            }}
          >
            <div
              className="theme-preview-swatch w-10 h-10 rounded-xl shadow-sm"
              style={{
                '--preview-primary': previewTheme.primary,
                '--preview-dark': previewTheme.dark,
              }}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Tema {selectedBusinessType.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Tu panel y página de reservas usarán esta identidad visual.
              </p>
            </div>
          </div>
        )}

        <div className="w-full">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" required
                className="block w-full pl-9 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN CUENTA --- */}
      <div className="space-y-4 pt-2">
        <h3 className="font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          Datos del Administrador
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              type="text" required
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
              placeholder="Juan"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input 
              type="text" required
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
              placeholder="Pérez"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="email" required
              className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
              placeholder="juan@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="password" required minLength={8}
              className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Debe tener al menos 8 caracteres.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password" required minLength={8} autoComplete="new-password"
              className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        />
        <span className="text-xs leading-5 text-slate-600">
          Acepto los <Link to="/terms" target="_blank" className="font-semibold text-orange-600 hover:text-orange-700">Términos y Condiciones</Link> y la <Link to="/privacy" target="_blank" className="font-semibold text-orange-600 hover:text-orange-700">Política de Privacidad</Link> de Senzoly.
        </span>
      </label>

      <button 
        type="submit" 
        disabled={isLoading || isLoadingTypes}
        className="theme-primary-button w-full mt-4 flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear cuenta gratis'}
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-slate-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </form>
  );
}
