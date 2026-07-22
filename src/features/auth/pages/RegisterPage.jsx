import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Comienza gratis" 
      subtitle="Crea tu cuenta en segundos y empieza a gestionar tu negocio."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
