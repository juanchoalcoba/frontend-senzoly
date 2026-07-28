import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getTenantBySlug,
  getAvailableProfessionals,
  getAvailableSlots,
  createPublicBooking,
} from "../services/publicApi";
import { useTheme } from "../../../context/ThemeContext";
import { getBusinessTypePresentation } from "../../../theme/businessTypePresentation";
import ServiceImage from "../../../components/ServiceImage";
import {
  Clock,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  FileText,
} from "lucide-react";

const STEPS = [
  "Servicio",
  "Profesional",
  "Fecha y Hora",
  "Tus Datos",
  "Confirmación",
];

export default function PublicBookingPage() {
  const { slug } = useParams();
  const { setRouteThemeSlug } = useTheme();

  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [professionalsLoading, setProfessionalsLoading] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTenantBySlug(slug);
        setTenantData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    setRouteThemeSlug(tenantData?.tenant?.businessType?.slug || null);

    return () => setRouteThemeSlug(null);
  }, [tenantData?.tenant?.businessType?.slug, setRouteThemeSlug]);

  useEffect(() => {
    if (!selectedService) return;

    let isCurrentRequest = true;
    const fetchProfessionals = async () => {
      setProfessionalsLoading(true);
      setProfessionals([]);
      setSelectedProfessional(null);
      try {
        const data = await getAvailableProfessionals(slug, selectedService.id);
        if (!isCurrentRequest) return;
        setProfessionals(data);
        if (data.length === 1) setSelectedProfessional(data[0]);
      } catch (err) {
        if (isCurrentRequest) setProfessionals([]);
      } finally {
        if (isCurrentRequest) setProfessionalsLoading(false);
      }
    };

    fetchProfessionals();
    return () => {
      isCurrentRequest = false;
    };
  }, [selectedService, slug]);

  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlots([]);
      setSelectedSlot("");
      try {
        const data = await getAvailableSlots(
          slug,
          selectedService.id,
          selectedProfessional?.id,
          selectedDate,
        );
        setSlots(data);
      } catch (err) {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedService, selectedProfessional, selectedDate, slug]);

  const getTodayStr = () => {
    const d = new Date();
    // toISOString usa UTC y cerca de medianoche puede adelantar la fecha del negocio.
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPrice = (val) => {
    const num = parseFloat(val) || 0;
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSubmit = async () => {
    setFormError("");
    const { firstName, lastName, email, phone } = customerForm;
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("El nombre y apellido son obligatorios.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setFormError(
        "Debes indicar al menos un método de contacto (email o teléfono).",
      );
      return;
    }
    setSubmitting(true);
    try {
      const result = await createPublicBooking(slug, {
        serviceId: selectedService.id,
        employeeId: selectedProfessional?.id,
        bookingDate: selectedDate,
        startTime: selectedSlot,
        customer: customerForm,
        notes: customerForm.notes,
      });
      setConfirmation(result);
      setStep(4);
    } catch (err) {
      setFormError(err.message || "Error al confirmar la reserva.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="theme-public-shell min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3 text-white">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-orange-400" />
          <p className="text-sm text-slate-400">
            Cargando información del negocio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tenantData) {
    return (
      <div className="theme-public-shell min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center space-y-4 max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-white font-bold text-xl">
            Negocio no encontrado
          </h2>
          <p className="text-slate-400 text-sm">
            El enlace de reserva que seguiste no existe o no está activo.
          </p>
        </div>
      </div>
    );
  }

  const { tenant, services } = tenantData;
  const presentation = getBusinessTypePresentation(tenant.businessType?.slug);
  const BusinessIcon = presentation.icon;

  return (
    <div className="theme-public-shell min-h-screen font-sans">
      {/* Header del Negocio */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-white font-black text-2xl tracking-tight">
              {tenant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
              {tenant.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />{" "}
                  {tenant.address}
                </span>
              )}
              {tenant.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />{" "}
                  {tenant.phone}
                </span>
              )}
            </div>
            {tenant.description && (
              <p className="text-slate-400 text-xs mt-1.5 max-w-md">
                {tenant.description}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full border border-orange-500/30">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
              Reserva Online
            </span>
          </div>
        </div>
      </header>

      {/* Stepper */}
      {step < 4 && (
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-1">
            {STEPS.slice(0, 4).map((s, i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full transition-all ${
                    step === i
                      ? "bg-orange-500 text-white"
                      : step > i
                        ? "bg-orange-500/20 text-orange-400"
                        : "text-slate-600"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step > i
                        ? "bg-orange-500 text-white"
                        : step === i
                          ? "bg-white text-orange-600"
                          : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {step > i ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-px ${step > i ? "bg-orange-500/60" : "bg-slate-700"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* PASO 0: SELECCIÓN DE SERVICIO */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-xl">
              ¿Qué servicio deseas agendar?
            </h2>
            {services.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
                <BusinessIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>El negocio no tiene servicios activos en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s);
                      setSelectedDate("");
                      setSelectedSlot("");
                      setStep(1);
                    }}
                    className={`w-full text-left bg-white/5 border ${
                      selectedService?.id === s.id
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/10 hover:border-white/25"
                    } rounded-2xl overflow-hidden transition-all`}
                  >
                    <ServiceImage
                      src={s.image_url}
                      alt={`Imagen de ${s.name}`}
                      className="w-full h-32"
                      placeholderClassName="from-slate-800 to-orange-950 text-orange-300"
                    />
                    <div className="p-4">
                      <p className="text-white font-bold text-base">{s.name}</p>
                      {s.description && (
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />{" "}
                          {s.duration_minutes} min
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-orange-300">
                          <DollarSign className="w-3.5 h-3.5" />{" "}
                          {formatPrice(s.price)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 1: SELECCIÓN DE PROFESIONAL */}
        {step === 1 && selectedService && (
          <div className="space-y-5">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide">
                  Servicio seleccionado
                </p>
                <p className="text-white font-bold">{selectedService.name}</p>
                <p className="text-slate-400 text-xs">
                  {selectedService.duration_minutes} min ·{" "}
                  {formatPrice(selectedService.price)}
                </p>
              </div>
              <button
                onClick={() => setStep(0)}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Cambiar
              </button>
            </div>

            <div>
              <h2 className="text-white font-bold text-xl mb-1">
                Elige tu profesional
              </h2>
              <p className="text-slate-400 text-sm">
                Selecciona quién realizará tu servicio.
              </p>
            </div>

            {professionalsLoading ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-orange-400" />
                Buscando profesionales disponibles...
              </div>
            ) : professionals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
                <User className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                <p className="text-white font-semibold">
                  Reserva sin profesional
                </p>
                <p className="text-sm mt-1">
                  Este servicio se reservará directamente según el horario
                  general del negocio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {professionals.map((professional) => {
                  const isSelected =
                    selectedProfessional?.id === professional.id;
                  return (
                    <button
                      key={professional.id}
                      type="button"
                      onClick={() => setSelectedProfessional(professional)}
                      className={`group w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                          : "border-white/10 bg-white/5 hover:border-orange-400/50 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                          }`}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-bold truncate">
                            {professional.first_name} {professional.last_name}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            Profesional del servicio
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={professionalsLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 transition-all"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: FECHA Y HORA */}
        {step === 2 && selectedService && (
          <div className="space-y-5">
            {/* Selected service summary */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-xs font-semibold uppercase tracking-wide">
                  Servicio seleccionado
                </p>
                <p className="text-white font-bold">{selectedService.name}</p>
                <p className="text-slate-400 text-xs">
                  {selectedService.duration_minutes} min ·{" "}
                  {formatPrice(selectedService.price)}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Cambiar
              </button>
            </div>

            <div>
              <h2 className="text-white font-bold text-xl mb-4">
                Selecciona una fecha
              </h2>
              <input
                type="date"
                min={getTodayStr()}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
                className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            {selectedDate && (
              <div>
                <h2 className="text-white font-bold text-base mb-3">
                  Horarios Disponibles
                </h2>
                {slotsLoading ? (
                  <div className="text-slate-400 flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Calculando
                    franjas disponibles...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-slate-500 text-sm">
                    No hay horarios disponibles para esta fecha.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`min-h-12 rounded-lg text-sm font-semibold transition-all ${
                          !slot.available
                            ? "bg-slate-800/60 text-slate-500 border border-slate-700/60 cursor-not-allowed"
                            : selectedSlot === slot.time
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                              : "bg-white/5 text-slate-300 border border-white/10 hover:border-orange-400/40 hover:bg-orange-500/10"
                        }`}
                      >
                        <span className="block">{slot.time}</span>
                        {!slot.available && (
                          <span className="block text-[10px] font-medium mt-0.5">
                            Ocupado
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedSlot}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 transition-all"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: DATOS DEL CLIENTE */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Summary bar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <BusinessIcon className="w-3.5 h-3.5 text-orange-500" />{" "}
                {selectedService.name}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-orange-500" />
                {selectedProfessional
                  ? `${selectedProfessional.first_name} ${selectedProfessional.last_name}`
                  : "Sin profesional"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />{" "}
                {selectedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" /> {selectedSlot}
              </span>
            </div>

            <h2 className="text-white font-bold text-xl">
              Ingresa tus datos de contacto
            </h2>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" /> {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Juan"
                    value={customerForm.firstName}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="García"
                    value={customerForm.lastName}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-9 bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="+598 99 000 000"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full pl-9 bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">
                  Notas o indicaciones (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Alguna preferencia o indicación para el servicio?"
                  value={customerForm.notes}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, notes: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none placeholder:text-slate-600"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirmando...
                  </>
                ) : (
                  <>
                    Confirmar Reserva <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: CONFIRMACIÓN */}
        {step === 4 && confirmation && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-black text-2xl">
                ¡Reserva Confirmada!
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Te esperamos, {confirmation.customer.first_name}. Aquí tienes el
                resumen de tu cita:
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 max-w-sm mx-auto">
              <div className="flex items-center gap-3 text-sm">
                <BusinessIcon className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">
                    {presentation.serviceLabel}
                  </p>
                  <p className="text-white font-semibold">
                    {confirmation.service.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">Fecha y Hora</p>
                  <p className="text-white font-semibold">
                    {confirmation.booking.booking_date} —{" "}
                    {confirmation.booking.start_time?.substring(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">Profesional</p>
                  <p className="text-white font-semibold">
                    {confirmation.employee
                      ? `${confirmation.employee.first_name} ${confirmation.employee.last_name}`
                      : "No aplica"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">Total a Abonar</p>
                  <p className="text-white font-semibold">
                    {formatPrice(confirmation.booking.total_price)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs">
              Ante cualquier cambio, comunícate con{" "}
              <strong className="text-slate-300">{tenant.name}</strong>
              {tenant.phone && (
                <>
                  {" "}
                  al <strong className="text-slate-300">{tenant.phone}</strong>
                </>
              )}
              .
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
