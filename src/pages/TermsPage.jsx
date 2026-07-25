import React from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout title="Términos y Condiciones" updatedAt="Julio de 2026">
      <p>Bienvenido a Senzoly. Al registrarte y utilizar nuestra plataforma aceptás estos Términos y Condiciones.</p>
      <Section title="Uso del servicio">Senzoly es una plataforma que permite gestionar agendas, reservas, clientes y reportes para negocios que trabajan con turnos.</Section>
      <Section title="Registro">El usuario es responsable de la información proporcionada al crear su cuenta y de mantener la confidencialidad de sus credenciales.</Section>
      <Section title="Responsabilidad del usuario">El usuario se compromete a utilizar Senzoly de forma legal y a no cargar información falsa, ilícita o que vulnere derechos de terceros.</Section>
      <Section title="Pagos">Las suscripciones podrán abonarse mediante Mercado Pago, transferencia bancaria o efectivo, según las opciones disponibles. La falta de pago podrá ocasionar la suspensión del servicio.</Section>
      <Section title="Disponibilidad">Senzoly realiza esfuerzos para mantener el servicio disponible, aunque no garantiza un funcionamiento ininterrumpido debido a tareas de mantenimiento o causas ajenas a nuestro control.</Section>
      <Section title="Cancelación">El usuario puede solicitar la eliminación de su cuenta en cualquier momento. Los datos serán eliminados dentro de los 30 días posteriores a la solicitud.</Section>
      <Section title="Propiedad intelectual">Todo el contenido, diseño, marca y software de Senzoly pertenece a su titular y no puede copiarse ni distribuirse sin autorización.</Section>
      <Section title="Legislación aplicable">Estos términos se rigen por las leyes de la República Oriental del Uruguay.</Section>
    </LegalPageLayout>
  );
}

function Section({ title, children }) {
  return <section className="mt-8"><h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2><p>{children}</p></section>;
}
