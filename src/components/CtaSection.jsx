import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/20 blur-[100px] rounded-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Comienza hoy mismo con <span className="text-[#FF6B00]">Senzoly</span>
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Crea tu cuenta gratuita en menos de un minuto y descubre una nueva forma de gestionar tu negocio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E56000] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
          >
            Comenzar gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <a 
            href="#planes"
            className="w-full sm:w-auto flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md transition-all border border-white/10"
          >
            Ver planes
          </a>
        </div>
      </div>
    </section>
  );
}
