import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes gradientBorder {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .badge-gradient-border {
          background: linear-gradient(270deg, #FF6B00, #f43f5e, #a855f7, #3b82f6, #FF6B00);
          background-size: 300% 300%;
          animation: gradientBorder 5s ease infinite;
        }
      `}</style>
      <section className="relative overflow-hidden bg-white min-h-[calc(100vh-5rem)] flex items-center py-12 lg:pt-12 lg:pb-12 2xl:pt-16 2xl:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Column - Text content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              {/* Logo Senzoly visible exclusivamente en celulares (Mobile) */}
              <div className="flex md:hidden justify-center mb-2">
                <img
                  src="/logotipo.png"
                  alt="Senzoly"
                  className="h-24 w-auto object-contain"
                />
              </div>

              {/* Badge premium con borde gradiente animado */}
              <div className="inline-flex mb-6">
                <div
                  className="badge-gradient-border p-[1.5px] rounded-full"
                  style={{
                    boxShadow:
                      "0 0 18px 2px rgba(168,85,247,0.18), 0 0 8px 1px rgba(255,107,0,0.13)",
                  }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white">
                    <span className="text-base">🚀</span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        background: "linear-gradient(90deg, #FF6B00, #a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Software de reservas para negocios inteligentes
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl text-center md:text-left tracking-tight font-bold  text-slate-900 sm:text-6xl md:text-6xl lg:text-6xl xl:text-5xl mb-6 leading-16">
                Reservas simples, <br className="hidden md:block" />
                <span className="text-[#FF6B00]">negocios que crecen</span>
              </h1>

              <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                Senzoly es la plataforma todo-en-uno para gestionar reservas,
                clientes y equipos de forma fácil y automática. Ahorra tiempo,
                mejora la experiencia y haz crecer tu negocio.
              </p>

              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="bg-[#FF6B00] hover:bg-[#E56000] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  Comenzar gratis
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                  Ver cómo funciona
                  <svg
                    className="w-5 h-5 text-slate-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              {/* Checkmarks */}
              <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm font-medium text-slate-600">
                <div className="flex items-center justify-center lg:justify-start gap-2 whitespace-nowrap">
                  <div className="bg-orange-100 rounded-full p-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Sin tarjeta de crédito
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 whitespace-nowrap">
                  <div className="bg-orange-100 rounded-full p-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Cancela cuando quieras
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 whitespace-nowrap">
                  <div className="bg-orange-100 rounded-full p-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Soporte 24/7
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:flex lg:mb-10 lg:col-span-6 relative justify-center lg:justify-end items-center">
              {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/20 blur-3xl rounded-full -z-10"></div>

              <img
                src="/heroright.png"
                alt="Senzoly Dashboard"
                className="w-full max-w-2xl h-auto object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
