import React from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function TenantSuspendedPage() {
  return (
    <AuthLayout title="Cuenta suspendida" subtitle="Tu empresa no puede utilizar Senzoly en este momento.">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
        <CircleAlert className="mx-auto mb-3 h-9 w-9 text-amber-600" />
        <p className="text-sm text-amber-900">
          Tu cuenta se encuentra suspendida. Comunícate con Senzoly para obtener más información.
        </p>
      </div>
      <Link to="/login" className="mt-6 block text-center text-sm font-medium text-orange-600 hover:text-orange-500">
        Volver al inicio de sesión
      </Link>
    </AuthLayout>
  );
}
