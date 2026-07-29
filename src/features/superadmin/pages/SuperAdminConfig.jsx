import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Webhook,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Zap,
  Database,
  Mail,
  Lock,
} from 'lucide-react';

const BACKEND_URL = 'https://senzoly-backend-production.up.railway.app';
const FRONTEND_URL = 'https://senzoly.com';
const WEBHOOK_URL = `${BACKEND_URL}/api/payments/webhook`;

const InfoRow = ({ label, value, copyable = false, mono = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-4">
      <span className="text-sm text-slate-500 font-medium shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-sm text-slate-900 font-semibold truncate ${mono ? 'font-mono text-xs bg-slate-100 px-2 py-0.5 rounded' : ''}`}>
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Copiar"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, subtitle, iconBg, iconColor, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-1">{children}</div>
  </div>
);

export default function SuperAdminConfig() {
  const [webhookCopied, setWebhookCopied] = useState(false);

  const copyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">
          Parámetros globales de la plataforma, integraciones y variables de entorno de producción.
        </p>
      </div>

      {/* Webhook de MercadoPago — Destacado */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Webhook className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold">Webhook de MercadoPago</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                Producción
              </span>
            </div>
            <p className="text-indigo-200 text-xs mb-4 leading-relaxed">
              Esta URL debe estar configurada en el panel de desarrolladores de MercadoPago para recibir notificaciones de pagos aprobados automáticamente.
            </p>
            <div className="bg-indigo-800/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3 border border-indigo-500/40">
              <code className="text-xs text-indigo-100 font-mono truncate">{WEBHOOK_URL}</code>
              <button
                onClick={copyWebhook}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                {webhookCopied ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Copiado</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copiar</>
                )}
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Evento: <strong className="text-white">payment</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Método: <strong className="text-white">POST</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Idempotente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URLs de Producción */}
        <SectionCard
          icon={Globe}
          title="URLs de Producción"
          subtitle="Dominios configurados en Railway y Vercel"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        >
          <InfoRow label="Frontend" value={FRONTEND_URL} mono copyable />
          <InfoRow label="Backend API" value={`${BACKEND_URL}/api`} mono copyable />
          <InfoRow label="Webhook MP" value={WEBHOOK_URL} mono copyable />
        </SectionCard>

        {/* MercadoPago */}
        <SectionCard
          icon={CreditCard}
          title="MercadoPago"
          subtitle="Integración con Checkout Pro en Producción"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        >
          <InfoRow label="Modo" value="Producción" />
          <InfoRow label="Client ID" value="6585227270904743" mono />
          <InfoRow label="Checkout" value="Checkout Pro" />
          <InfoRow label="Flujo" value="redirect → webhook → activación" />
        </SectionCard>

        {/* Variables Railway */}
        <SectionCard
          icon={Database}
          title="Variables de Entorno — Railway"
          subtitle="Configuración del servidor backend en producción"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        >
          <InfoRow label="BACKEND_URL" value="✅ Configurada" />
          <InfoRow label="FRONTEND_URL" value="✅ Configurada" />
          <InfoRow label="MERCADOPAGO_ACCESS_TOKEN" value="✅ Configurada" />
          <InfoRow label="MERCADOPAGO_PUBLIC_KEY" value="✅ Configurada" />
          <InfoRow label="MERCADOPAGO_CLIENT_ID" value="✅ Configurada" />
          <InfoRow label="MERCADOPAGO_CLIENT_SECRET" value="✅ Configurada" />
          <InfoRow label="JWT_SECRET" value="✅ Configurada" />
          <InfoRow label="DATABASE_URL" value="✅ Railway PostgreSQL" />
        </SectionCard>

        {/* Variables Vercel */}
        <SectionCard
          icon={Zap}
          title="Variables de Entorno — Vercel"
          subtitle="Configuración del cliente frontend en producción"
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        >
          <InfoRow label="VITE_API_URL" value="✅ Configurada" />
          <div className="py-3 mt-2">
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <code className="text-xs font-mono text-slate-600 block">
                VITE_API_URL=https://senzoly-backend-production<br />
                .up.railway.app/api
              </code>
            </div>
          </div>
        </SectionCard>

        {/* Seguridad */}
        <SectionCard
          icon={Shield}
          title="Seguridad"
          subtitle="Mecanismos de protección habilitados"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        >
          {[
            'JWT con expiración por sesión',
            'Middleware de suscripción en cada request',
            'Webhook idempotente (sin duplicados)',
            'Verificación de pago con API de MP (no confía en URL de retorno)',
            'Trust Proxy habilitado en Railway (HTTPS)',
            'Headers de seguridad (X-Frame, HSTS, nosniff)',
            'CORS restringido a dominios de producción',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-slate-100 last:border-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </SectionCard>

        {/* Email */}
        <SectionCard
          icon={Mail}
          title="Emails Transaccionales"
          subtitle="Proveedor Resend configurado"
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
        >
          <InfoRow label="Proveedor" value="Resend" />
          <InfoRow label="API Key" value="✅ Configurada en Railway" />
          <InfoRow label="Emails activos" value="Verificación de cuenta" />
          <InfoRow label="Emails activos" value="Recuperación de contraseña" />
          <div className="py-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700 font-medium">
                📋 Próximamente: email de confirmación de pago y bienvenida al plan.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Links rápidos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Links de Acceso Rápido</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { label: 'Panel de Desarrolladores MercadoPago', url: 'https://www.mercadopago.com.ar/developers/panel/app', desc: 'Configurar webhook y credenciales de producción' },
            { label: 'Railway — Backend', url: 'https://railway.app', desc: 'Variables de entorno, logs y deployments del servidor' },
            { label: 'Vercel — Frontend', url: 'https://vercel.com', desc: 'Variables de entorno y deployments del cliente' },
            { label: 'Cloudinary', url: 'https://cloudinary.com', desc: 'Gestión de imágenes de servicios y recursos' },
            { label: 'Resend', url: 'https://resend.com', desc: 'Gestión de emails transaccionales y logs' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{link.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{link.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
