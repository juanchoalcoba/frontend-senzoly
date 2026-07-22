import React from 'react';
import { Layers, Clock, BarChart3, TrendingUp } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="sobre-nosotros">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-200/40 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Sobre Nosotros
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Impulsamos negocios que <span className="text-[#FF6B00]">viven de las reservas</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Senzoly nace para simplificar la gestión diaria de profesionales y empresas que trabajan con agenda. 
              Desde una sola plataforma podrás administrar reservas, clientes, empleados, servicios y estadísticas 
              para tomar mejores decisiones y hacer crecer tu negocio.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Organización inteligente</h3>
                <p className="text-sm text-slate-600">Centraliza toda la información de tu negocio en un solo lugar.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Más tiempo para clientes</h3>
                <p className="text-sm text-slate-600">Automatiza tareas repetitivas y dedica más tiempo a lo importante.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Estadísticas en tiempo real</h3>
                <p className="text-sm text-slate-600">Conoce el rendimiento de tu negocio mediante métricas claras.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Crecimiento continuo</h3>
                <p className="text-sm text-slate-600">Senzoly evoluciona constantemente incorporando nuevas funcionalidades.</p>
              </div>
            </div>
          </div>

          {/* 3D Illustration */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Glassmorphism backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF6B00]/20 blur-[80px] rounded-full"></div>
            </div>
            
            <img 
              src="/about-illustration.png" 
              alt="Senzoly 3D Illustration" 
              className="relative z-10 w-[110%] max-w-none h-auto object-contain hover:-translate-y-2 transition-transform duration-700 ease-out"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
