import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import Typed from "typed.js";

export default function Hero() {
  const typedHeadlineRef = useRef(null);

  useEffect(() => {
    if (!typedHeadlineRef.current) return undefined;

    // El contenido inicial es el fallback sin JavaScript. Se limpia antes de
    // iniciar Typed para que el primer ciclo también se escriba desde cero.
    typedHeadlineRef.current.innerHTML = "";

    const typed = new Typed(typedHeadlineRef.current, {
      strings: [
        'Reservas simples,<br /> <span class="typed-headline-accent">negocios que crecen</span>',
      ],
      typeSpeed: 42,
      backSpeed: 24,
      backDelay: 2400,
      startDelay: 250,
      loop: true,
      showCursor: true,
      cursorChar: "|",
      contentType: "html",
    });

    return () => typed.destroy();
  }, []);

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

        @keyframes heroAmbientDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(16px, 12px, 0); }
        }

        @keyframes heroAmbientDriftReverse {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-14px, -10px, 0); }
        }

        .hero-ambient {
          position: absolute;
          width: 52rem;
          height: 52rem;
          border-radius: 9999px;
          pointer-events: none;
        }

        .hero-ambient-indigo {
          top: -34rem;
          left: -30rem;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0.018) 38%, transparent 70%);
          animation: heroAmbientDrift 34s ease-in-out infinite;
        }

        .hero-ambient-cyan {
          right: -31rem;
          bottom: -35rem;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, rgba(6, 182, 212, 0.014) 40%, transparent 70%);
          animation: heroAmbientDriftReverse 38s ease-in-out infinite;
        }

        .hero-depth-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(248, 250, 252, 0.65));
        }

        .hero-fine-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.012;
          background-image: linear-gradient(rgba(15, 23, 42, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.8) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hero-content-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 42rem;
          height: 30rem;
          border-radius: 9999px;
          pointer-events: none;
          background: rgba(99, 102, 241, 1);
          opacity: 0.08;
          filter: blur(120px);
          transform: translate(-50%, -50%);
        }

        .typed-headline-accent {
          color: #FF6B00;
          display: inline-block;
          white-space: nowrap;
        }

        .typed-cursor {
          color: #FF6B00;
        }

        @media (max-width: 1023px) {
          .hero-ambient {
            width: 40rem;
            height: 40rem;
          }

          .hero-ambient-indigo {
            top: -25rem;
            left: -24rem;
          }

          .hero-ambient-cyan {
            right: -25rem;
            bottom: -27rem;
          }

          .hero-content-glow {
            width: 34rem;
            height: 24rem;
            filter: blur(96px);
          }
        }

        @media (max-width: 639px) {
          .hero-ambient {
            width: 30rem;
            height: 30rem;
          }

          .hero-ambient-indigo {
            top: -19rem;
            left: -18rem;
          }

          .hero-ambient-cyan {
            right: -20rem;
            bottom: -21rem;
          }

          .hero-content-glow {
            width: 24rem;
            height: 18rem;
            filter: blur(72px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ambient-indigo,
          .hero-ambient-cyan,
          .typed-cursor {
            animation: none;
          }

          .typed-cursor {
            display: none;
          }
        }
      `}</style>
      <section className="relative isolate overflow-hidden bg-white min-h-[calc(100vh-5rem)] flex items-center py-12 lg:pt-12 lg:pb-12 2xl:pt-16 2xl:pb-20">
        <div aria-hidden="true" className="hero-ambient hero-ambient-indigo" />
        <div aria-hidden="true" className="hero-ambient hero-ambient-cyan" />
        <div aria-hidden="true" className="hero-depth-overlay" />
        <div aria-hidden="true" className="hero-fine-grid" />
        <div aria-hidden="true" className="hero-content-glow" />
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none"
             viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-50,210 C 250,30 500,430 750,170 C 1000,-50 1250,300 1500,150"
                fill="none" stroke="#cbd5e1" strokeWidth="6" opacity="0.18" />
          <path d="M-50,260 C 250,80 500,480 750,220 C 1000,0 1250,350 1500,200"
                fill="none" stroke="#FF6B00" strokeWidth="4" opacity="0.14" />
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Column - Text content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              {/* Logo Senzoly visible exclusivamente en celulares (Mobile) */}
              <div className="flex md:hidden justify-center ">
                <img
                  src="/logotipo.png"
                  alt="Senzoly"
                  className="h-48 w-auto object-contain"
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

              <h1
                aria-label="Reservas simples, negocios que crecen"
                className="min-h-[4.8rem] text-[clamp(1.75rem,8.5vw,2.25rem)] leading-[1.2] text-center tracking-tight font-bold text-slate-900 sm:min-h-[6rem] sm:text-5xl md:min-h-[7.5rem] md:text-6xl md:text-left lg:min-h-[8rem] lg:text-6xl xl:text-5xl mb-6 lg:leading-16"
              >
                <span ref={typedHeadlineRef} aria-hidden="true">
                  Reservas simples,
                  <br />
                  <span className="typed-headline-accent">
                    negocios que crecen
                  </span>
                </span>
              </h1>

              <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl mb-8 text-center md:text-left max-w-xl mx-auto lg:mx-0">
                Senzoly es la plataforma todo-en-uno para gestionar reservas,
                clientes y equipos de forma fácil y automática.
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
                <Link to="/como-funciona" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                  Ver cómo funciona
                  <svg
                    className="w-5 h-5 text-slate-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
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

            <style>{`
@keyframes heroFloat {
  0%,100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.03);
  }
}
`}</style>

            {/* Right Column - Image */}
            <div className="hidden lg:flex lg:mb-10 lg:col-span-6 relative justify-center lg:justify-end items-center">
              <img
                src="/heroright.webp"
                alt="Senzoly Dashboard"
                className="w-full max-w-2xl h-auto object-contain relative z-10"
                style={{
                  animation: "heroFloat 6s ease-in-out infinite",
                  filter: "drop-shadow(0 0 35px rgba(251,146,60,.35))",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
