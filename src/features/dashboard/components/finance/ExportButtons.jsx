import React from 'react';
import { Download, Printer } from 'lucide-react';

export default function ExportButtons({ movements = [], overview, tenantName }) {
  const handleExportCSV = () => {
    if (!movements || movements.length === 0) {
      alert('No hay movimientos financieros para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Fecha / Hora',
      'Tipo',
      'Categoria',
      'Cliente',
      'Servicio / Concepto',
      'Empleado',
      'Metodo de Pago',
      'Monto Bruto ($)',
      'Pago Empleado ($)',
      'Neto Negocio ($)',
      'Notas',
    ];

    const rows = movements.map((m) => [
      m.id,
      new Date(m.createdAt).toLocaleString('es-ES'),
      m.type || 'INCOME',
      m.category || 'SERVICE_BOOKING',
      `"${m.customerName || ''}"`,
      `"${m.serviceName || ''}"`,
      `"${m.employeeName || ''}"`,
      m.paymentMethod || 'CASH',
      m.grossAmount,
      m.employeePayout,
      m.businessNetIncome,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Financiero_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        title="Descargar historial en CSV / Excel"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Exportar Excel</span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        title="Imprimir o guardar reporte PDF"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Imprimir PDF</span>
      </button>
    </div>
  );
}
