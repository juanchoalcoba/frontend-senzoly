import { isBypassActive, clearMaintenanceBypass, MAINTENANCE_CONFIG } from '../config/maintenanceConfig';
import { AlertCircle, Eye, Lock } from 'lucide-react';

export default function AdminMaintenanceBanner() {
  if (!MAINTENANCE_CONFIG.isActive || !isBypassActive()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-slate-900/95 border border-amber-500/40 text-slate-200 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="font-semibold text-amber-400">Web en Pausa Global</span>
        <span className="text-slate-400 hidden sm:inline">(Navegando en modo bypass)</span>
      </div>

      <button
        onClick={clearMaintenanceBypass}
        className="ml-2 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
        title="Volver a bloquear la sesión para ver la pantalla de pausa"
      >
        <Lock className="w-3 h-3" />
        <span>Bloquear vista</span>
      </button>
    </div>
  );
}
