import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  // Número de soporte en Uruguay (092 931 652 -> +59892931652)
  const phoneNumber = '59892931652';
  const defaultMessage = encodeURIComponent(
    'Hola Senzoly, quisiera consultar sobre la plataforma de reservas.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip / Badge flotante en hover */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl transition-all duration-300 transform ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
        }`}
        aria-label="Hablar por WhatsApp con Soporte"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>¿Dudas? Hablá con soporte</span>
      </a>

      {/* Botón Principal Flotante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contactar soporte por WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/50 hover:bg-[#20bd5a] transform hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
      >
        {/* Anillo de animación suave */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-pulse blur-sm transition-opacity duration-300"></span>

        {/* Icono de WhatsApp */}
        <FaWhatsapp className="relative z-10 w-8 h-8 text-white drop-shadow-sm" />

        {/* Badge indicador online */}
        <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-emerald-400 z-20" />
      </a>
    </div>
  );
}
