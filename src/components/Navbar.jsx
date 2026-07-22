import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer mt-6">
            <img src="/logotipo.png" alt="Senzoly" className="h-48" />
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#inicio"
              className="text-orange-600 font-medium text-sm hover:text-orange-700 transition-colors"
            >
              Inicio
            </a>
            <a
              href="#funciones"
              className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
            >
              Funciones
            </a>
            <a
              href="#precios"
              className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
            >
              Precios
            </a>
            <a
              href="#casos"
              className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
            >
              Casos de éxito
            </a>
            <div className="relative group flex items-center cursor-pointer">
              <span className="text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors">
                Recursos
              </span>
              <svg
                className="ml-1 w-4 h-4 text-slate-400 group-hover:text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </nav>

          {/* Right Buttons */}
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
        </div>
      </div>
    </header>
  );
}
