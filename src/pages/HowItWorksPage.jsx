import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChartNoAxesCombined, ClipboardList, Rocket, Settings2, Share2, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
  { title: 'Crear cuenta', description: 'Registra tu negocio y empieza con una base clara para tu operación.', icon: UserPlus },
  { title: 'Configurar negocio', description: 'Define tus servicios, horarios y la información que verán tus clientes.', icon: Settings2 },
  { title: 'Publicar agenda', description: 'Comparte una agenda profesional lista para recibir solicitudes online.', icon: Share2 },
  { title: 'Recibir reservas online', description: 'Tus clientes eligen el servicio y horario que necesitan.', icon: CalendarDays },
  { title: 'Administrar clientes', description: 'Consulta reservas y datos importantes en un solo lugar.', icon: ClipboardList },
  { title: 'Hacer crecer el negocio', description: 'Trabaja con más orden y toma mejores decisiones cada día.', icon: ChartNoAxesCombined },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">Así funciona Senzoly</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">De una agenda vacía a un negocio más organizado</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Un recorrido simple para poner tus reservas online y concentrarte en atender mejor.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative space-y-5 pl-10 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-orange-100 md:pl-0 md:before:left-1/2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const reverse = index % 2 === 1;
                return (
                  <div key={step.title} className={`relative grid gap-5 md:grid-cols-2 md:gap-12 ${reverse ? 'md:text-left' : ''}`}>
                    <div className={reverse ? 'md:col-start-2' : ''}>
                      <article className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B00]"><Icon className="h-6 w-6" /></div>
                          <div><p className="text-sm font-semibold text-orange-600">Paso {index + 1}</p><h2 className="text-xl font-bold text-slate-900">{step.title}</h2></div>
                        </div>
                        <p className="mt-4 leading-7 text-slate-600">{step.description}</p>
                      </article>
                    </div>
                    <div className={`absolute left-5 top-7 z-10 flex h-5 w-5 rounded-full border-4 border-white bg-[#FF6B00] shadow-sm md:left-1/2 md:-translate-x-1/2 ${reverse ? '' : ''}`} aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12">
            <Rocket className="mx-auto h-9 w-9 text-[#FF6B00]" />
            <h2 className="mt-4 text-3xl font-bold text-white">Tu próxima reserva puede empezar ahora</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">Crea tu cuenta, configura tu agenda y descubre una forma más simple de organizar el día a día.</p>
            <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#E56000]">Comenzar gratis <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
