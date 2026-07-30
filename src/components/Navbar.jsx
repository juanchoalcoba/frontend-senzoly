import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import Logo from "./Logo";

export default function Navbar() {
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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link to="/">
                <img
                  src="/logotipo.png"
                  alt="Senzoly"
                  className="h-16 md:h-24 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Center Links (Desktop) */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="/#inicio"
                className="text-orange-600 font-medium text-sm hover:text-orange-700 transition-colors"
              >
                Inicio
              </a>
              <Link
                to="/como-funciona"
                className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
              >
                Funciones
              </Link>
              <a
                href="/#planes"
                className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
              >
                Precios
              </a>
              <Link
                to="/casos-de-exito"
                className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
              >
                Casos de éxito
              </Link>
            </nav>

            {/* Right Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/login"
                className="text-slate-900 font-medium text-sm hover:text-slate-600 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-[#FF6B00] hover:bg-[#E56000] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md shadow-orange-500/20"
              >
                Comenzar gratis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={toggleMenu}
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isOpen}
                className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú principal">
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
              <a href="/#inicio" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Inicio</a>
              <Link to="/como-funciona" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Funciones</Link>
              <a href="/#planes" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Precios</a>
              <Link to="/casos-de-exito" onClick={closeMenu} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">Casos de éxito</Link>
            </div>

            <div className="mt-auto space-y-3 border-t border-slate-100 pt-6">
              <Link to="/register" onClick={closeMenu} className="block rounded-xl bg-[#FF6B00] px-4 py-3 text-center font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-[#E56000]">Comenzar gratis</Link>
              <Link to="/login" onClick={closeMenu} className="block rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-800 transition-colors hover:bg-slate-50">Iniciar sesión</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
