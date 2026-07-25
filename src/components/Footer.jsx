import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="Ir al inicio de Senzoly">
              <img src="/logotipo.png" alt="Senzoly" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Gestión simple y profesional para negocios que trabajan con reservas.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm md:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-slate-600">
              <a href="#funciones" className="hover:text-slate-950 transition-colors">Funciones</a>
              <a href="#planes" className="hover:text-slate-950 transition-colors">Planes</a>
              <Link to="/terms" className="hover:text-slate-950 transition-colors">Términos</Link>
              <Link to="/privacy" className="hover:text-slate-950 transition-colors">Privacidad</Link>
            </div>
            <a href="mailto:contacto.aguirre78@gmail.com" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors">
              <Mail className="w-4 h-4" /> contacto.aguirre78@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Senzoly. Todos los derechos reservados.</span>
          <span>Hecho para negocios que avanzan.</span>
        </div>
      </div>
    </footer>
  );
}
