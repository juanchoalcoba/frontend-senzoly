import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PricingTable from './PricingTable';

const plans = [
  {
    name: 'Prueba',
    price: 'Gratis durante 30 días',
    description: 'Ideal para conocer la plataforma.',
    features: [
      'Hasta 20 reservas por mes',
      '1 agenda',
      'Gestión de clientes',
      'Gestión de servicios',
      'Recordatorios automáticos',
      'Vista diaria, semanal y mensual',
      'Reporte básico de ingresos',
      'Soporte por correo'
    ],
    buttonText: 'Comenzar gratis',
    popular: false,
    icon: '🆓'
  },
  {
    name: 'Solo',
    price: '$1.490 / mes',
    description: 'Para profesionales independientes.',
    features: [
      'Todo lo incluido en Prueba, más:',
      'Reservas ilimitadas',
      'Agenda ilimitada',
      'Clientes ilimitados',
      'Servicios ilimitados',
      'Recordatorios automáticos',
      'Reportes diarios, semanales y mensuales',
      'Comparación con meses anteriores',
      'Mejor mes histórico',
      'Estadísticas de ingresos',
      'Historial de clientes',
      'Búsqueda avanzada',
      'Dashboard con métricas',
      'Exportar PDF'
    ],
    buttonText: 'Elegir plan',
    popular: false,
    icon: '👤'
  },
  {
    name: 'Equipo',
    price: '$2.490 / mes',
    description: 'Ideal para pequeños equipos.',
    features: [
      'Todo lo del plan Solo más:',
      'Hasta 5 empleados',
      'Agenda por empleado',
      'Panel administrador',
      'Estadísticas por empleado',
      'Facturación por empleado',
      'Comisiones',
      'Servicios por empleado',
      'Ranking de empleados',
      'Permisos por usuario',
      'Dashboard general',
      'Exportar Excel',
      'Soporte prioritario'
    ],
    buttonText: 'Elegir plan',
    popular: true,
    icon: '👥'
  },
  {
    name: 'Pro+',
    price: '$3.990 / mes',
    description: 'Para empresas en crecimiento.',
    features: [
      'Todo lo del plan Equipo más:',
      'Empleados ilimitados',
      'Sucursales ilimitadas',
      'Comparación entre sucursales y empleados',
      'Dashboard ejecutivo',
      'Indicadores de crecimiento',
      'Ticket promedio',
      'Clientes nuevos vs recurrentes',
      'Horarios de mayor demanda',
      'Servicios más rentables',
      'Días con mayor facturación',
      'Porcentaje de ocupación',
      'Cancelaciones y ausencias',
      'Reportes avanzados y exportación completa',
      'Acceso anticipado a nuevas funciones',
      'Soporte Premium'
    ],
    buttonText: 'Elegir plan',
    popular: false,
    icon: '🚀'
  }
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="planes">
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-sm mb-6">
            Precios Claros
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Planes para cada etapa de tu negocio
          </h2>
          <p className="text-lg text-slate-600">
            Comienza gratis y actualiza únicamente cuando tu negocio lo necesite.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col h-full bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular 
                  ? 'border-2 border-[#FF6B00] shadow-lg shadow-orange-500/10 scale-105 xl:scale-110 z-10' 
                  : 'border border-slate-100 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                  Más Popular
                </div>
              )}
              
              <div className="mb-6">
                <span className="text-4xl mb-4 block">{plan.icon}</span>
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-extrabold text-slate-900">{plan.price.split(' ')[0]}</span>
                  {plan.price.includes('/') && <span className="text-slate-500 font-medium"> {plan.price.replace(plan.price.split(' ')[0], '')}</span>}
                  {!plan.price.includes('/') && <span className="text-slate-500 font-medium block mt-1">{plan.price.replace(plan.price.split(' ')[0], '').trim()}</span>}
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <Link 
                to="/register"
                className={`w-full block text-center py-3 px-4 rounded-xl font-semibold transition-colors mb-8 ${
                  plan.popular
                    ? 'bg-[#FF6B00] hover:bg-[#E56000] text-white shadow-md'
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                }`}
              >
                {plan.buttonText}
              </Link>

              <div className="flex-1 space-y-4">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${fIdx === 0 && plan.name !== 'Prueba' ? 'text-[#FF6B00]' : 'text-green-500'}`} />
                    <span className={`text-sm ${fIdx === 0 && plan.name !== 'Prueba' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Table */}
        <PricingTable />

      </div>
    </section>
  );
}
