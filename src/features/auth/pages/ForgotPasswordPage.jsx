import React from 'react';
import AuthLayout from '../components/AuthLayout';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Recupera tu contraseña" subtitle="Te enviaremos un enlace seguro para crear una nueva contraseña.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
