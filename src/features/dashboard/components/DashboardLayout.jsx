import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../config/navConfig";
import MobileHeader from "./MobileHeader";

export default function DashboardLayout({ children }) {
  const { user, tenant, logout } = useAuth();

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* ── Sidebar Desktop ── */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen shrink-0">
        {/* Logo — pegado arriba, sin padding extra */}
        <div className="shrink-0">
          <img
            src="/logotipo.png"
            alt="Senzoly"
            className="h-24 w-full object-contain object-top"
          />
        </div>

        {/* Navegación Desktop */}
        <nav className="flex-1 overflow-y-auto px-4 pt-1 pb-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Usuario + Cerrar sesión — siempre visible abajo */}
        <div className="shrink-0 p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm">
                {tenant?.name?.[0]?.toUpperCase() ||
                  user?.firstName?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold text-slate-900 truncate"
                  title={tenant?.name}
                >
                  {tenant?.name || "Cargando..."}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.role === "OWNER" ? "Propietario" : user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        {/* Header móvil profesional con Drawer lateral */}
        <MobileHeader />

        {/* Contenido de la página */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
