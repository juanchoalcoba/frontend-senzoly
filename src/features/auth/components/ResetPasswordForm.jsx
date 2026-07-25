import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../services/authApi';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('El enlace de recuperación no es válido. Solicita uno nuevo.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ token, password, confirmPassword });
      setCompleted(true);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100">
        <CheckCircle2 className="w-10 h-10 mx-auto text-green-600 mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Contraseña actualizada</h3>
        <p className="text-sm text-slate-600 mt-2">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link to="/login" className="inline-block mt-5 text-sm font-semibold text-orange-600 hover:text-orange-500">Ir a iniciar sesión</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
      <p className="text-sm text-slate-600">Elige una contraseña nueva de al menos 8 caracteres.</p>
      {[
        { label: 'Nueva contraseña', value: password, setValue: setPassword },
        { label: 'Confirmar nueva contraseña', value: confirmPassword, setValue: setConfirmPassword },
      ].map((field) => (
        <div key={field.label}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
          <div className="relative">
            <Lock className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400" />
            <input
              type="password" required minLength={8} autoComplete="new-password"
              value={field.value}
              onChange={(event) => field.setValue(event.target.value)}
              className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
            />
          </div>
        </div>
      ))}
      <button type="submit" disabled={isLoading} className="theme-primary-button w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold disabled:opacity-70">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar nueva contraseña'}
      </button>
    </form>
  );
}
