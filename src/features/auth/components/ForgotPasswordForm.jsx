import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset } from '../services/authApi';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100">
        <CheckCircle2 className="w-10 h-10 mx-auto text-green-600 mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Revisa tu correo</h3>
        <p className="text-sm text-slate-600 mt-2">
          Si existe una cuenta con ese correo, recibirás un enlace para crear una nueva contraseña.
        </p>
        <Link to="/login" className="inline-block mt-5 text-sm font-semibold text-orange-600 hover:text-orange-500">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
        <div className="relative">
          <Mail className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400" />
          <input
            type="email" required autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="juan@empresa.com"
            className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors sm:text-sm"
          />
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="theme-primary-button w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold disabled:opacity-70">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar enlace de recuperación'}
      </button>
      <p className="text-center text-sm text-slate-600">
        <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500">Volver a iniciar sesión</Link>
      </p>
    </form>
  );
}
