import React from "react";
import { Link } from "react-router-dom";

import PricingTable from "./PricingTable";
import { CheckCircle2, Gift, UserRound, Users, Rocket } from "lucide-react";

const plans = [
  {
    name: "Prueba",
    price: "Gratis durante 30 días",
    description: "Conoce Senzoly sin compromiso.",
    features: [
      "Reservas ilimitadas",
      "1 agenda",
      "Hasta 7 empleados",
      "Gestión de clientes",
      "Gestión de servicios",
      "Recordatorios automáticos",
      "Calendario completo",
      "Reportes básicos",
      "Soporte por correo",
    ],
    buttonText: "Comenzar gratis",
    popular: false,
    icon: Gift,
  },
  {
    name: "Individual",
    price: "$1.490 / mes",
    description: "Para profesionales independientes.",
    features: [
      "Todo lo de Prueba",
      "Reservas ilimitadas",
      "Agendas ilimitadas",
      "Clientes ilimitados",
      "Servicios ilimitados",
      "Dashboard personal",
      "Estadísticas",
      "Historial de clientes",
    ],
    buttonText: "Elegir plan",
    popular: false,
    icon: UserRound,
  },
  {
    name: "Equipo",
    price: "$2.490 / mes",
    description: "Perfecto para pequeños equipos.",
    features: [
      "Todo lo de Individual",
      "Hasta 7 empleados",
      "Agenda por empleado",
      "Panel administrador",
      "Comisiones",
      "Permisos por usuario",
      "Ranking de empleados",
      "Soporte prioritario",
    ],
    buttonText: "Elegir plan",
    popular: true,
    icon: Users,
  },
  {
    name: "Pro+",
    price: "$3.990 / mes",
    description: "Pensado para empresas en crecimiento.",
    features: [
      "Todo lo de Equipo",
      "Empleados ilimitados",
      "Sucursales ilimitadas",
      "Dashboard ejecutivo",
      "Comparativas avanzadas",
      "Indicadores de crecimiento",
      "Reportes avanzados",
      "Soporte Premium",
    ],
    buttonText: "Elegir plan",
    popular: false,
    icon: Rocket,
  },
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
            Comienza gratis y actualiza únicamente cuando tu negocio lo
            necesite.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;

            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular
                    ? "border-2 border-[#FF6B00] bg-gradient-to-b from-orange-50 to-white shadow-xl shadow-orange-200/40 xl:-translate-y-3 z-20"
                    : "border border-slate-200 bg-white shadow-md hover:border-orange-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide shadow-lg">
                    Más popular
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col items-center text-center min-h-[210px]">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                      plan.popular
                        ? "bg-orange-100 text-[#FF6B00]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon size={34} strokeWidth={2.2} />
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                    {plan.name}
                  </h3>

                  <div className="mt-5">
                    <span className="text-4xl font-extrabold leading-none text-slate-900">
                      {plan.price.split(" ")[0]}
                    </span>

                    {plan.price.includes("/") ? (
                      <span className="ml-2 text-base font-medium text-slate-500">
                        {plan.price.replace(plan.price.split(" ")[0], "")}
                      </span>
                    ) : (
                      <p className="mt-2 text-base text-slate-500">
                        {plan.price
                          .replace(plan.price.split(" ")[0], "")
                          .trim()}
                      </p>
                    )}
                  </div>

                  <p className="mt-5 text-sm text-slate-500 min-h-[48px] flex items-center">
                    {plan.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 my-7" />

                {/* Features */}
                <div className="flex-1 space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`w-[18px] h-[18px] shrink-0 ${
                          fIdx === 0 && plan.name !== "Prueba"
                            ? "text-[#FF6B00]"
                            : "text-green-500"
                        }`}
                      />

                      <span
                        className={`text-[15px] leading-tight ${
                          fIdx === 0 && plan.name !== "Prueba"
                            ? "font-semibold text-slate-900"
                            : "text-slate-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="pt-8">
                  <Link
                    to="/register"
                    className={`block w-full rounded-2xl py-4 text-center font-semibold transition-all duration-300 hover:scale-[1.02] ${
                      plan.popular
                        ? "bg-[#FF6B00] hover:bg-[#E56000] text-white shadow-lg shadow-orange-300/30"
                        : "bg-orange-50 hover:bg-orange-100 text-orange-600"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Table */}
        <PricingTable />
      </div>
    </section>
  );
}
