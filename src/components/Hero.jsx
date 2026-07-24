import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import { HiOutlineCalendarDays } from "react-icons/hi2";

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

              {/* Badge */}
<div className="flex justify-center lg:justify-start mb-6">
  <div className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white px-5 py-2 shadow-sm">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
      <HiOutlineCalendarDays className="h-4 w-4 text-[#FF6B00]" />
    </div>

    <span
      className="text-sm font-semibold"
      style={{
        background: "linear-gradient(90deg, #FF6B00, #a855f7)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      Reservas para negocios inteligentes
    </span>
  </div>
</div>

              <h1 className="text-4xl text-center md:text-left tracking-tight font-bold  text-slate-900 sm:text-6xl md:text-6xl lg:text-6xl xl:text-5xl mb-6 lg:leading-16">
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

{/* Redes Sociales */}
<div className="mt-7 flex justify-center lg:justify-start gap-4">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/senzoly"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all duration-300 flex items-center justify-center text-slate-700"
  >
    <FaInstagram size={22} />
  </a>

  {/* WhatsApp */}
  <a
    href="https://wa.me/59899458702"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all duration-300 flex items-center justify-center text-slate-700"
  >
    <FaWhatsapp size={22} />
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/company/senzoly"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all duration-300 flex items-center justify-center text-slate-700"
  >
    <FaLinkedinIn size={20} />
  </a>
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
