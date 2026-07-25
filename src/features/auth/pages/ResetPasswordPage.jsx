import React from 'react';
import AuthLayout from '../components/AuthLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Crea una nueva contraseña" subtitle="Elige una contraseña segura para recuperar el acceso a tu cuenta.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
