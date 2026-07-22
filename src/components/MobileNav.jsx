import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <>
      {/* Mobile Top Header (Logo + Hamburger) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="h-6 w-auto text-[#FF6B00]" fill="currentColor">
             <path d="M75,25 C75,11.19 63.81,0 50,0 C36.19,0 25,11.19 25,25 C25,32.84 28.6,39.84 34.19,44.4 L65.81,55.6 C71.4,60.16 75,67.16 75,75 C75,88.81 63.81,100 50,100 C36.19,100 25,88.81 25,75 L25,65 L45,65 L45,75 C45,77.76 47.24,80 50,80 C52.76,80 55,77.76 55,75 C55,71.74 53.07,68.91 50.19,67.75 L18.37,56.61 C12.14,54.43 7.81,48.65 7.81,41.97 C7.81,32.6 15.41,25 24.78,25 L75,25 Z M50,60 C44.48,60 40,55.52 40,50 C40,44.48 44.48,40 50,40 C55.52,40 60,44.48 60,50 C60,55.52 55.52,60 50,60 Z" />
           </svg>
           <span className="text-lg font-bold tracking-tight text-slate-900">Senzoly</span>
        </div>
        <button className="text-slate-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Navigation (as requested) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2 text-slate-500">
          <a href="#inicio" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#FF6B00]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] font-medium">Inicio</span>
          </a>
          <a href="#funciones" className="flex flex-col items-center justify-center w-full h-full space-y-1 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[10px] font-medium">Funciones</span>
          </a>
          <a href="#precios" className="flex flex-col items-center justify-center w-full h-full space-y-1 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[10px] font-medium">Precios</span>
          </a>
          <Link to="/login" className="flex flex-col items-center justify-center w-full h-full space-y-1 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-[10px] font-medium">Cuenta</span>
          </Link>
        </div>
      </div>
    </>
  );
}
