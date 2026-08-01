import React from 'react';
import { Check, X } from 'lucide-react';

const features = [
  { name: 'Reservas por mes', prueba: 'Ilimitadas', solo: 'Ilimitadas', equipo: 'Ilimitadas', pro: 'Ilimitadas' },
  { name: 'Empleados', prueba: 'Hasta 7', solo: '1', equipo: 'Hasta 7', pro: 'Ilimitados' },
  { name: 'Sucursales', prueba: '1', solo: '1', equipo: '1', pro: 'Ilimitadas' },
  { name: 'Gestión de clientes y servicios', prueba: true, solo: true, equipo: true, pro: true },
  { name: 'Recordatorios automáticos', prueba: true, solo: true, equipo: true, pro: true },
  { name: 'Reportes de ingresos', prueba: 'Básico', solo: 'Avanzado', equipo: 'Avanzado', pro: 'Ejecutivo' },
  { name: 'Comparación histórica', prueba: false, solo: true, equipo: true, pro: true },
  { name: 'Estadísticas por empleado', prueba: false, solo: false, equipo: true, pro: true },
  { name: 'Permisos por usuario', prueba: false, solo: false, equipo: true, pro: true },
  { name: 'Indicadores avanzados (Ticket Promedio, etc)', prueba: false, solo: false, equipo: false, pro: true },
  { name: 'Soporte', prueba: 'Correo', solo: 'Correo', equipo: 'Prioritario', pro: 'Premium' },
];

export default function PricingTable() {
  return (
    <div className="mt-20 overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="w-1/3 py-4 px-6 text-sm font-semibold text-slate-900 border-b border-slate-200">
                Comparativa de funciones
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-900 border-b border-slate-200 text-center">
                Prueba
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-900 border-b border-slate-200 text-center">
                Individual
              </th>
              <th className="py-4 px-6 text-sm font-bold text-[#FF6B00] border-b-2 border-[#FF6B00] text-center">
                Equipo
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-900 border-b border-slate-200 text-center">
                Pro+
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((feat, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                  {feat.name}
                </td>
                
                {/* Prueba */}
                <td className="py-4 px-6 text-sm text-slate-600 text-center">
                  {typeof feat.prueba === 'boolean' ? (
                    feat.prueba ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feat.prueba
                  )}
                </td>
                
                {/* Individual */}
                <td className="py-4 px-6 text-sm text-slate-600 text-center">
                  {typeof feat.solo === 'boolean' ? (
                    feat.solo ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feat.solo
                  )}
                </td>
                
                {/* Equipo */}
                <td className="py-4 px-6 text-sm font-medium text-slate-900 text-center bg-orange-50/30">
                  {typeof feat.equipo === 'boolean' ? (
                    feat.equipo ? <Check className="w-5 h-5 text-[#FF6B00] mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feat.equipo
                  )}
                </td>
                
                {/* Pro+ */}
                <td className="py-4 px-6 text-sm text-slate-600 text-center">
                  {typeof feat.pro === 'boolean' ? (
                    feat.pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feat.pro
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
