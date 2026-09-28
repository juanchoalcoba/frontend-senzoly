/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURACIÓN GLOBAL DE MANTENIMIENTO / SUSPENSIÓN - SENZOLY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📌 CÓMO ACTIVAR O DESACTIVAR:
 * • Para pausar la web (activo ahora):    isActive: true
 * • Para reactivar la web completamente:  isActive: false
 * 
 * También puedes usar la variable de entorno:
 * VITE_MAINTENANCE_MODE=true  (o false)
 * 
 * 🔑 ACCESO DE EMERGENCIA / BYPASS ADMINISTRADOR:
 * Si necesitas acceder a la web o al Super Admin mientras está en pausa:
 * 1. Agrega '?bypass=admin2026' a la URL (ej: senzoly.com/super-admin/login?bypass=admin2026)
 * 2. O haz clic en el enlace sutil "Acceso Técnico" al pie de la pantalla de mantenimiento.
 */

export const MAINTENANCE_CONFIG = {
  // 🔴 Cambia este valor a 'false' cuando desees volver a activar toda la web:
  isActive: true,

  // Clave de bypass para administradores (permite ver la web normalmente en tu navegador)
  bypassKey: 'admin2026',

  // Información visual mostrada en la pantalla
  badge: 'Mantenimiento Preventivo Programado',
  title: 'Plataforma en Mantenimiento',
  subtitle:
    'Estamos realizando labores técnicas de actualización y optimización de infraestructura tanto en el portal público como en las plataformas de administración.',
  reassurance:
    'Toda la información, reservas, registros y configuraciones se encuentran totalmente resguardados y seguros.',
  estimatedTime: 'Volveremos a estar disponibles y 100% operativos a la brevedad.',
  contactEmail: 'soporte@senzoly.com',
};

/**
 * Función que determina si la pantalla de mantenimiento debe mostrarse.
 */
export const checkIsMaintenanceActive = () => {
  // 1. Revisar variable de entorno si fue definida
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAINTENANCE_MODE !== undefined) {
    if (import.meta.env.VITE_MAINTENANCE_MODE === 'false' || import.meta.env.VITE_MAINTENANCE_MODE === false) {
      return false;
    }
    if (import.meta.env.VITE_MAINTENANCE_MODE === 'true' || import.meta.env.VITE_MAINTENANCE_MODE === true) {
      // continuar a verificar bypass
    }
  } else if (!MAINTENANCE_CONFIG.isActive) {
    return false;
  }

  // 2. Revisar bypass por parámetro de URL (?bypass=admin2026)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const bypassQuery = urlParams.get('bypass');
      if (bypassQuery && (bypassQuery === MAINTENANCE_CONFIG.bypassKey || bypassQuery === 'true')) {
        sessionStorage.setItem('senzoly_maintenance_bypass', 'true');
        return false;
      }

      // 3. Revisar si ya tiene bypass guardado en la sesión activa del navegador
      if (sessionStorage.getItem('senzoly_maintenance_bypass') === 'true') {
        return false;
      }
    } catch {
      // En caso de que sessionStorage o window fallen, continuar
    }
  }

  return true;
};

/**
 * Permite cerrar la sesión de bypass y volver a ver la pantalla de pausa
 */
export const clearMaintenanceBypass = () => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('senzoly_maintenance_bypass');
      window.location.reload();
    } catch {}
  }
};
