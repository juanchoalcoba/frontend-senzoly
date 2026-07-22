import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left side - Visual/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#FF6B00] flex-col justify-between overflow-hidden h-full">
        {/* Background Patterns & Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-orange-800/30 blur-3xl rounded-full"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8 lg:p-12 flex flex-col h-full">
          {/* Compensate for image internal padding by pulling it up and centering */}
          <div className="flex justify-center -mt-16">
            <Link to="/">
              <img src="/logotipo.png" alt="Senzoly" className="w-[28rem] max-w-none h-auto object-contain brightness-0 invert" />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center -mt-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Gestiona tu negocio <br /> como un profesional.
            </h1>
            <p className="text-orange-100 text-lg max-w-md">
              Únete a miles de empresas que ya automatizan sus reservas, 
              controlan su equipo y multiplican sus ingresos con Senzoly.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-orange-100/80 text-sm mt-auto">
            <span>© {new Date().getFullYear()} Senzoly.</span>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white lg:h-full lg:overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden p-2 border-b border-slate-100 flex justify-center overflow-hidden h-24 items-center">
          <Link to="/" className="-mt-4">
            <img src="/logotipo.png" alt="Senzoly" className="w-[24rem] max-w-none h-auto object-contain" />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10 mt-4 lg:mt-0">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
              {subtitle && <p className="text-slate-500">{subtitle}</p>}
            </div>
            
            {children}
            
          </div>
        </div>
      </div>
    </div>
  );
}
