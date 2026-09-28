import { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { MAINTENANCE_CONFIG } from '../config/maintenanceConfig';

export default function MaintenancePage() {
  const [checking, setChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState(null);
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassCode, setBypassCode] = useState('');
  const [bypassError, setBypassError] = useState('');

  const handleCheckStatus = () => {
    setChecking(true);
    setCheckStatus(null);
    setTimeout(() => {
      setChecking(false);
      // Intentar refrescar la página para verificar si ya fue reactivada
      window.location.reload();
    }, 1200);
  };

  const handleBypassSubmit = (e) => {
    e.preventDefault();
    if (bypassCode.trim() === MAINTENANCE_CONFIG.bypassKey) {
      sessionStorage.setItem('senzoly_maintenance_bypass', 'true');
      window.location.reload();
    } else {
      setBypassError('Clave de acceso incorrecta');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-orange-500 selection:text-white font-sans">
      {/* Luces de fondo ambientales / Glow suave y sutil */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-orange-500/15 via-amber-500/10 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[500px] h-[350px] bg-gradient-to-t from-orange-600/10 via-amber-600/5 to-transparent blur-3xl opacity-50" />

      {/* Barra superior con logotipo */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logotipo.png" 
            alt="Senzoly" 
            className="h-9 w-auto object-contain filter drop-shadow-sm brightness-110" 
          />
        </div>

        {/* Indicador de estado en vivo sutil */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wide backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span>Mantenimiento en curso</span>
        </div>
      </header>

      {/* Contenido Central */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto px-6 py-6 flex flex-col items-center justify-center text-center">
        
        {/* Badge sutil */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>{MAINTENANCE_CONFIG.badge}</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Estamos optimizando la plataforma
        </h1>

        {/* Párrafo explicativo suave y tranquilizador */}
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {MAINTENANCE_CONFIG.subtitle}
        </p>

        {/* Tarjeta de tranquilidad / Resguardo de datos */}
        <div className="mt-8 w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Datos Seguros</h2>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Todas tus reservas, clientes y registros permanecen 100% protegidos y respaldados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Actualizaciones</h2>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Optimizando servidores y tiempos de respuesta para mejorar la experiencia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Regreso Pronto</h2>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {MAINTENANCE_CONFIG.estimatedTime}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Acciones principales */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Verificando estado...' : 'Comprobar disponibilidad'}</span>
          </button>

          {MAINTENANCE_CONFIG.contactEmail && (
            <a
              href={`mailto:${MAINTENANCE_CONFIG.contactEmail}?subject=Consulta%20sobre%20mantenimiento%20Senzoly`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800 font-medium text-sm transition-colors duration-200"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Contactar Soporte</span>
            </a>
          )}
        </div>

        {checkStatus && (
          <p className="mt-3 text-xs text-amber-400 font-medium animate-fade-in">
            {checkStatus}
          </p>
        )}

      </main>

      {/* Pie de página sutil con opción de acceso técnico */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-900">
        <div>
          © {new Date().getFullYear()} Senzoly. Plataforma integral de reservas y gestión.
        </div>

        {/* Acceso técnico discreto para administradores */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBypassModal(true)}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs cursor-pointer"
            title="Acceso exclusivo para administradores"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Acceso Técnico</span>
          </button>
        </div>
      </footer>

      {/* Modal sutil de acceso técnico / bypass */}
      {showBypassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-white font-semibold text-base mb-1">
              <Lock className="w-4 h-4 text-orange-400" />
              <span>Acceso de Administración</span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Ingresa la clave de acceso para ver la web o el Super Admin mientras se encuentra en modo mantenimiento.
            </p>

            <form onSubmit={handleBypassSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={bypassCode}
                  onChange={(e) => {
                    setBypassCode(e.target.value);
                    setBypassError('');
                  }}
                  placeholder="Introduce la clave de acceso"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  autoFocus
                />
                {bypassError && (
                  <p className="text-xs text-rose-400 mt-1.5 font-medium">{bypassError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowBypassModal(false);
                    setBypassCode('');
                    setBypassError('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Acceder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
