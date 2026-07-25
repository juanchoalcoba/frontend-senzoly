import React from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Política de Privacidad" updatedAt="Julio de 2026">
      <p>En Senzoly respetamos la privacidad de nuestros usuarios.</p>
      <Section title="Datos que recopilamos">
        <p>Podemos almacenar:</p>
        <ul className="mt-3 list-disc pl-5 space-y-1"><li>Nombre del negocio.</li><li>Nombre del propietario.</li><li>Correo electrónico, teléfono y dirección.</li><li>Nombre, teléfono y correo electrónico de los clientes registrados por el negocio.</li></ul>
      </Section>
      <Section title="Uso de la información"><p>La información se utiliza para gestionar agendas y reservas, enviar recordatorios por WhatsApp, brindar soporte y mejorar la plataforma.</p></Section>
      <Section title="Seguridad"><p>Aplicamos medidas razonables para proteger la información almacenada contra accesos no autorizados.</p></Section>
      <Section title="Conservación"><p>Si un usuario solicita eliminar su cuenta, los datos serán eliminados dentro de un plazo máximo de 30 días, salvo obligación legal de conservarlos.</p></Section>
      <Section title="Derechos"><p>Los usuarios podrán solicitar el acceso, modificación o eliminación de sus datos escribiendo a <a className="font-semibold text-orange-600 hover:text-orange-700" href="mailto:contacto.aguirre78@gmail.com">contacto.aguirre78@gmail.com</a>.</p></Section>
      <Section title="Cambios"><p>Senzoly podrá actualizar esta Política de Privacidad cuando sea necesario. La versión vigente estará siempre disponible dentro de la plataforma.</p></Section>
    </LegalPageLayout>
  );
}

function Section({ title, children }) {
  return <section className="mt-8"><h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>{children}</section>;
}
