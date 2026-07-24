import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { NAV_ITEMS } from "../config/navConfig";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, tenant, logout } = useAuth();

  // Cerrar el Drawer presionado la tecla Escape y bloquear scroll del body mientras está abierto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Fixed Mobile Header (SaaS style: backdrop blur, border-b sutil) ── */}
      <header className="sticky top-0 z-30 h-16 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between md:hidden shrink-0 transition-all">
        {/* Logo Senzoly */}
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 focus:outline-none rounded-lg"
        >
          <img
            src="/logotipo.png"
            alt="Senzoly OS"
            className="h-9 w-auto object-contain"
          />
        </NavLink>

        {/* Botón Hamburger Accesible */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={isOpen}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
        >
          <Menu className="w-6 h-6 stroke-[1.8]" />
        </button>
      </header>

      {/* ── Mobile Drawer & Backdrop ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Overlay oscuro con blur suave */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Lateral Derecho */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
            className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out animate-in slide-in-from-right"
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <img
                  src="/logotipo.png"
                  alt="Senzoly"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Navegación
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? "bg-orange-50 text-orange-600 font-semibold shadow-2xs border-l-4 border-orange-500 pl-2.5"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 shrink-0 ${
                            isActive
                              ? "text-orange-600 stroke-[2.25]"
                              : "text-slate-400 stroke-[1.75]"
                          }`}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Drawer Footer: Usuario & Cerrar sesión */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 shrink-0 space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {tenant?.name?.[0]?.toUpperCase() ||
                    user?.firstName?.[0]?.toUpperCase() ||
                    "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold text-slate-900 truncate"
                    title={tenant?.name}
                  >
                    {tenant?.name || "Cargando..."}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.firstName} {user?.lastName} (
                    {user?.role === "OWNER" ? "Propietario" : user?.role})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-100 hover:border-red-200 rounded-xl font-semibold transition-all shadow-2xs active:scale-[0.99]"
              >
                <LogOut className="w-4 h-4 shrink-0 stroke-[2]" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
