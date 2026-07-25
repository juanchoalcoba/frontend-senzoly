import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalPageLayout({ title, updatedAt, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" aria-label="Ir al inicio de Senzoly">
            <img src="/logotipo.png" alt="Senzoly" className="h-14 w-auto object-contain" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Volver al inicio</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
        <p className="text-sm font-semibold text-orange-600">SENZOLY · LEGAL</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Última actualización: {updatedAt}</p>
        <article className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm text-slate-600 leading-7">
          {children}
        </article>
      </main>
    </div>
  );
}
