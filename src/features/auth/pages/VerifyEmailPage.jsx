import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { verifyEmail } from '../services/authApi';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const requestedTokenRef = useRef(null);
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no es válido o está incompleto.');
      return;
    }

    if (requestedTokenRef.current === token) {
      return;
    }

    requestedTokenRef.current = token;

    verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Error al verificar el correo.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-orange-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verificando tu cuenta</h2>
            <p className="text-slate-500">Espera un momento por favor...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Correo verificado!</h2>
            <p className="text-slate-500 mb-8">
              Tu cuenta ha sido activada exitosamente. Ya puedes acceder al panel de control de tu empresa.
            </p>
            <Link 
              to="/login"
              className="w-full bg-[#FF6B00] hover:bg-[#E56000] text-white py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              Ir a Iniciar sesión
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Enlace inválido</h2>
            <p className="text-slate-500 mb-8">{message}</p>
            <Link 
              to="/login"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
