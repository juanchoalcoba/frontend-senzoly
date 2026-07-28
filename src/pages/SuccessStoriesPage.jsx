import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Scissors, Sparkles, Stethoscope, Trophy, Star, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';

const stories = [
  {
    business: 'Barbería Norte', category: 'Barbería', person: 'Martín Pereira', icon: Scissors,
    quote: 'Ordenamos la agenda en pocos días. Ahora el equipo ve todos los turnos claros y los clientes reservan sin mensajes de ida y vuelta.',
  },
  {
    business: 'Lumen Studio', category: 'Salón de belleza', person: 'Carolina Viera', icon: Sparkles,
    quote: 'Nos gustó que fuera simple desde el primer día. Pudimos centralizar servicios, clientes y reservas sin cambiar nuestra forma de atender.',
  },
  {
    business: 'Sonrisa Clínica', category: 'Clínica odontológica', person: 'Dra. Valentina Costa', icon: Stethoscope,
    quote: 'La agenda online nos ayuda a organizar mejor el día y a que cada paciente encuentre un horario disponible con facilidad.',
  },
  {
    business: 'Punto de Juego', category: 'Canchas deportivas', person: 'Federico Ramos', icon: Trophy,
    quote: 'Cada cancha tiene su disponibilidad clara. Eso nos permitió evitar confusiones y dar una respuesta más rápida a quienes quieren reservar.',
  },
  {
    business: 'Aura Estética', category: 'Centro de estética', person: 'Lucía Fernández', icon: Sparkles,
    quote: 'Senzoly nos da una visión ordenada del negocio. Tenemos menos tareas manuales y más tiempo para enfocarnos en la experiencia de cada clienta.',
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MobileNav />
      <main>
        <section className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">Casos de éxito</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Negocios que trabajan con más claridad</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Historias representativas de cómo distintos equipos podrían simplificar sus reservas y la gestión diaria con Senzoly.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => {
                const Icon = story.icon;
                return (
                  <article key={story.business} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B00]"><Icon className="h-6 w-6" /></div>
                      <Quote className="h-7 w-7 text-orange-200" />
                    </div>
                    <div className="mt-6 flex gap-1 text-amber-400" aria-label="Calificación de 5 estrellas">
                      {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="mt-5 flex-1 text-[15px] leading-7 text-slate-600">“{story.quote}”</p>
                    <div className="mt-7 border-t border-slate-100 pt-5">
                      <p className="font-semibold text-slate-900">{story.business}</p>
                      <p className="mt-1 text-sm text-[#FF6B00]">{story.category}</p>
                      <p className="mt-3 text-sm text-slate-500">{story.person}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-white">Una agenda más simple empieza hoy</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">Conoce Senzoly y crea una experiencia de reserva más ordenada para tu negocio.</p>
            <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#E56000]">Comenzar gratis <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
