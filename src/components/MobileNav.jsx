import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeMenu = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/95 p-4 backdrop-blur-md">
        <Link to="/" className="flex items-center" aria-label="Ir al inicio de Senzoly">
          <img src="/logotipo.png" alt="Senzoly" className="h-12 w-auto object-contain" />
        </Link>
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menú principal">
          <style>{`
            @keyframes mobileMenuOpen { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes mobileMenuClose { from { transform: translateX(0); } to { transform: translateX(100%); } }
          `}</style>
          <button
            type="button"
            onClick={closeMenu}
            className={`absolute inset-0 h-full w-full bg-slate-950/35 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            aria-label="Cerrar menú"
          />
          <nav
            className="absolute right-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col bg-white p-6 shadow-2xl"
            style={{ animation: `${isClosing ? 'mobileMenuClose' : 'mobileMenuOpen'} 220ms ease-out forwards` }}
          >
            <div className="mb-10 flex items-center justify-between">
              <img src="/logotipo.png" alt="Senzoly" className="h-14 w-auto object-contain" />
              <button type="button" onClick={closeMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Cerrar menú">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <Link to="/" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Inicio</Link>
              <a href="/#sobre-nosotros" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Características</a>
              <Link to="/casos-de-exito" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Casos de éxito</Link>
              <a href="/#planes" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Precios</a>
              <a href="mailto:contacto.aguirre78@gmail.com" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Contacto</a>
            </div>

            <div className="mt-auto space-y-3 border-t border-slate-100 pt-6">
              <Link to="/register" onClick={closeMenu} className="block rounded-xl bg-[#FF6B00] px-4 py-3 text-center font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-[#E56000]">Comienza gratis</Link>
              <Link to="/login" onClick={closeMenu} className="block rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-800 transition-colors hover:bg-slate-50">Iniciar sesión</Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
